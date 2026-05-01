"""
MCU Admin Bot
─────────────────────────────────────────
• Watches a private channel for files
• Replies with file_name + file_id
• Saves to Firestore (primary + backup)
• Broadcasts text or photo+caption to main bot users
"""

import asyncio
import logging
import os
from datetime import datetime, timezone

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.exceptions import TelegramForbiddenError, TelegramNotFound, TelegramRetryAfter
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import Message
from dotenv import load_dotenv
from google.cloud import firestore

load_dotenv()

# ── Config ─────────────────────────────────────────────────────────────────
ADMIN_BOT_TOKEN = os.environ["ADMIN_BOT_TOKEN"]
MAIN_BOT_TOKEN  = os.environ["MAIN_BOT_TOKEN"]
ADMIN_ID        = int(os.environ["ADMIN_ID"])
CHANNEL_ID      = int(os.environ["CHANNEL_ID"])
FIRESTORE_PROJ  = os.environ["FIRESTORE_PROJECT"]

RATE_LIMIT_SEC  = 1 / 30   # 30 messages/sec

# ── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
log = logging.getLogger("admin_bot")

# ── Firestore ──────────────────────────────────────────────────────────────
db = firestore.Client(project=FIRESTORE_PROJ)

# ── Bots ───────────────────────────────────────────────────────────────────
admin_bot = Bot(token=ADMIN_BOT_TOKEN, parse_mode=ParseMode.MARKDOWN_V2)
main_bot  = Bot(token=MAIN_BOT_TOKEN)

dp = Dispatcher(storage=MemoryStorage())


# ══════════════════════════════════════════════════════════════════════════
# UTILS
# ══════════════════════════════════════════════════════════════════════════

def escape_md(text: str) -> str:
    """Escape special characters for MarkdownV2."""
    special = r"\_*[]()~`>#+-=|{}.!"
    return "".join(f"\\{c}" if c in special else c for c in text)


# ══════════════════════════════════════════════════════════════════════════
# FIRESTORE HELPERS
# ══════════════════════════════════════════════════════════════════════════

def save_file_to_firestore(file_id: str, file_name: str, file_type: str):
    """Write to primary and backup collections."""
    data = {
        "file_id":     file_id,
        "file_name":   file_name,
        "file_type":   file_type,
        "uploaded_at": datetime.now(timezone.utc),
    }
    db.collection("mcu_files").document(file_id).set(data)
    db.collection("mcu_files_backup").document(file_id).set(data)
    log.info(f"Saved to Firestore — {file_name} [{file_type}]")


# ══════════════════════════════════════════════════════════════════════════
# FILE CATCHER  (channel posts)
# ══════════════════════════════════════════════════════════════════════════

def extract_file_info(message: Message):
    """
    Pull (file_id, file_name, file_type) from any message type.
    Returns None if no supported file found.
    """
    if message.video:
        return (
            message.video.file_id,
            message.video.file_name or "unknown_video",
            "video",
        )
    if message.document:
        return (
            message.document.file_id,
            message.document.file_name or "unknown_document",
            "document",
        )
    if message.photo:
        photo = message.photo[-1]
        return (
            photo.file_id,
            f"photo_{photo.file_unique_id}.jpg",
            "photo",
        )
    if message.audio:
        return (
            message.audio.file_id,
            message.audio.file_name or "unknown_audio",
            "audio",
        )
    return None


@dp.channel_post(F.chat.id == CHANNEL_ID)
async def on_channel_file(message: Message):
    """Fires when anything is posted in the private channel."""
    info = extract_file_info(message)
    if not info:
        return

    file_id, file_name, file_type = info

    save_file_to_firestore(file_id, file_name, file_type)

    # Reply in channel
    reply_text = (
        "📁 *File Captured\\!*\n\n"
        f"*Name:* `{escape_md(file_name)}`\n"
        f"*Type:* `{escape_md(file_type)}`\n"
        f"*ID:* `{escape_md(file_id)}`\n\n"
        "✅ Saved to Firestore \\(primary \\+ backup\\)"
    )
    await message.reply(reply_text)

    # Notify admin privately
    await admin_bot.send_message(
        ADMIN_ID,
        "📥 *New file in channel\\!*\n\n"
        f"*{escape_md(file_name)}*\n"
        f"`{escape_md(file_id)}`",
    )


# ══════════════════════════════════════════════════════════════════════════
# BROADCAST SYSTEM
# ══════════════════════════════════════════════════════════════════════════

class BroadcastStates(StatesGroup):
    waiting_for_text          = State()
    waiting_for_photo         = State()
    waiting_for_photo_caption = State()


@dp.message(Command("broadcast"), F.chat.id == ADMIN_ID)
async def cmd_broadcast(message: Message, state: FSMContext):
    await state.set_state(BroadcastStates.waiting_for_text)
    await message.answer(
        "📝 *Send me the broadcast message\\.*\n\n"
        "Telegram formatting supported:\n"
        "`*bold*` → *bold*\n"
        "`_italic_` → _italic_\n\n"
        "Send /cancel to abort\\."
    )


@dp.message(BroadcastStates.waiting_for_text, F.chat.id == ADMIN_ID)
async def receive_broadcast_text(message: Message, state: FSMContext):
    await state.clear()
    text = message.text or message.caption
    if not text:
        await message.answer("❌ No text found\\. Cancelled\\.")
        return

    await message.answer("🚀 Starting broadcast\\.\\.\\.")
    sent, failed = await do_broadcast_text(text)
    await message.answer(
        "✅ *Broadcast complete\\!*\n\n"
        f"📤 Sent: *{sent}*\n"
        f"🚫 Failed/Pruned: *{failed}*"
    )


@dp.message(Command("broadcast_photo"), F.chat.id == ADMIN_ID)
async def cmd_broadcast_photo(message: Message, state: FSMContext):
    await state.set_state(BroadcastStates.waiting_for_photo)
    await message.answer(
        "🖼 *Send me the photo for the broadcast\\.*\n"
        "Send /cancel to abort\\."
    )


@dp.message(BroadcastStates.waiting_for_photo, F.photo, F.chat.id == ADMIN_ID)
async def receive_broadcast_photo(message: Message, state: FSMContext):
    photo_id = message.photo[-1].file_id
    await state.update_data(photo_id=photo_id)
    await state.set_state(BroadcastStates.waiting_for_photo_caption)
    await message.answer(
        "✏️ *Now send the caption for this photo\\.*\n"
        "Bold and italic formatting supported\\.\n"
        "Send /cancel to abort\\."
    )


@dp.message(BroadcastStates.waiting_for_photo_caption, F.chat.id == ADMIN_ID)
async def receive_broadcast_caption(message: Message, state: FSMContext):
    data     = await state.get_data()
    photo_id = data.get("photo_id")
    caption  = message.text or message.caption
    await state.clear()

    if not caption:
        await message.answer("❌ No caption found\\. Cancelled\\.")
        return

    await message.answer("🚀 Starting photo broadcast\\.\\.\\.")
    sent, failed = await do_broadcast_photo(photo_id, caption)
    await message.answer(
        "✅ *Broadcast complete\\!*\n\n"
        f"📤 Sent: *{sent}*\n"
        f"🚫 Failed/Pruned: *{failed}*"
    )


@dp.message(Command("cancel"), F.chat.id == ADMIN_ID)
async def cmd_cancel(message: Message, state: FSMContext):
    await state.clear()
    await message.answer("❌ Cancelled\\.")


@dp.message(Command("start", "help"), F.chat.id == ADMIN_ID)
async def cmd_help(message: Message):
    await message.answer(
        "🤖 *MCU Admin Bot*\n\n"
        "*Channel File Capture:*\n"
        "Drop any file in the private channel → I capture the ID and save to Firestore\\.\n\n"
        "*Commands:*\n"
        "/broadcast — Send text to all users\n"
        "/broadcast\\_photo — Send photo \\+ caption to all users\n"
        "/stats — Show counts\n"
        "/cancel — Cancel current operation\n\n"
        "_Files saved to primary \\+ backup collections\\._"
    )


@dp.message(Command("stats"), F.chat.id == ADMIN_ID)
async def cmd_stats(message: Message):
    users  = len(db.collection("mcu_users").get())
    active = len(db.collection("mcu_users").where("is_active", "==", True).get())
    files  = len(db.collection("mcu_files").get())
    await message.answer(
        "📊 *Stats*\n\n"
        f"👥 Total users: *{users}*\n"
        f"✅ Active users: *{active}*\n"
        f"📁 Stored files: *{files}*"
    )


# ══════════════════════════════════════════════════════════════════════════
# BROADCAST ENGINE
# ══════════════════════════════════════════════════════════════════════════

async def get_all_active_user_ids() -> list[int]:
    docs = db.collection("mcu_users").where("is_active", "==", True).stream()
    return [doc.to_dict()["user_id"] for doc in docs]


async def mark_inactive(user_id: int):
    db.collection("mcu_users").document(str(user_id)).update({"is_active": False})
    log.warning(f"Marked inactive: {user_id}")


async def do_broadcast_text(text: str) -> tuple[int, int]:
    user_ids = await get_all_active_user_ids()
    sent = failed = 0

    for uid in user_ids:
        retries = 0
        while retries < 3:
            try:
                await main_bot.send_message(
                    chat_id=uid,
                    text=text,
                    parse_mode=ParseMode.MARKDOWN_V2,
                )
                sent += 1
                break
            except TelegramRetryAfter as e:
                await asyncio.sleep(e.retry_after + 1)
                retries += 1
            except (TelegramForbiddenError, TelegramNotFound):
                await mark_inactive(uid)
                failed += 1
                break
            except Exception as e:
                log.error(f"Error sending to {uid}: {e}")
                failed += 1
                break
        await asyncio.sleep(RATE_LIMIT_SEC)

    return sent, failed


async def do_broadcast_photo(photo_id: str, caption: str) -> tuple[int, int]:
    user_ids = await get_all_active_user_ids()
    sent = failed = 0

    for uid in user_ids:
        retries = 0
        while retries < 3:
            try:
                await main_bot.send_photo(
                    chat_id=uid,
                    photo=photo_id,
                    caption=caption,
                    parse_mode=ParseMode.MARKDOWN_V2,
                )
                sent += 1
                break
            except TelegramRetryAfter as e:
                await asyncio.sleep(e.retry_after + 1)
                retries += 1
            except (TelegramForbiddenError, TelegramNotFound):
                await mark_inactive(uid)
                failed += 1
                break
            except Exception as e:
                log.error(f"Error sending to {uid}: {e}")
                failed += 1
                break
        await asyncio.sleep(RATE_LIMIT_SEC)

    return sent, failed


# ══════════════════════════════════════════════════════════════════════════
# ENTRY POINT
# ══════════════════════════════════════════════════════════════════════════

async def main():
    log.info("Admin bot starting...")
    await dp.start_polling(admin_bot)

if __name__ == "__main__":
    thread = threading.Thread(target=run_web, daemon=True)
    thread.start()
    asyncio.run(start_bot())