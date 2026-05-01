# 🎬 MCU Bot — Admin Bot

The admin backend for the MCU Telegram bot ecosystem. Handles file management, user database, and broadcasting.

---

## ✨ Features

- 📁 **File Catcher** — Drop any file in the private channel, bot instantly captures the Telegram file ID and saves it to Firestore
- 📣 **Broadcast System** — Send text or photo+caption to all users with bold/italic formatting support
- 🔥 **Firestore Database** — All files saved to primary + backup collections automatically
- 🟢 **Always Online** — Built-in health endpoint keeps the server alive 24/7

---

## 🛠 Tech Stack

- Python 3
- aiogram 3.x
- Google Cloud Firestore
- FastAPI + Uvicorn
- Hosted on Render (free tier)
- Kept alive by UptimeRobot

---

## ⚙️ Commands

| Command | Description |
|---|---|
| `/start` | Show help menu |
| `/broadcast` | Send text message to all users |
| `/broadcast_photo` | Send photo + caption to all users |
| `/stats` | Show user and file counts |
| `/cancel` | Cancel current operation |

---

## 🔒 Environment Variables

| Variable | Description |
|---|---|
| `ADMIN_BOT_TOKEN` | Admin bot token from @BotFather |
| `MAIN_BOT_TOKEN` | Main MCU bot token |
| `ADMIN_ID` | Your personal Telegram user ID |
| `CHANNEL_ID` | Private channel ID |
| `FIRESTORE_PROJECT` | Firebase project ID |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON |

---

> This is a private passion project. Not affiliated with Marvel or Disney.
