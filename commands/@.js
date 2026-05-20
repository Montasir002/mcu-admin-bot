/*CMD
  command: @
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

/*CMD
  command: @
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  aliases: 
  group: 
CMD*/

// Array of allowed Admin Telegram IDs (Add your new admin IDs here, separated by commas)
var ADMIN_IDS = [
  6065015255, 
  6588768434, // Example Admin ID 2
  6212930360  // Example Admin ID 3
];

// Checks if the user's ID exists inside the ADMIN_IDS array
function isAdmin() {
  return user && ADMIN_IDS.indexOf(user.telegramid) !== -1;
}

function requireAdmin() {
  if (!isAdmin()) { Bot.sendMessage("🚫 Admin only."); return false; }
  return true;
}

// FIX #3 + #12: safeDelete now uses tgUpdate (not deprecated request).
// Handles both callback_query and direct message contexts.
function safeDelete() {
  var msgId = null;
  try {
    if (tgUpdate.callback_query) {
      msgId = tgUpdate.callback_query.message.message_id;
    } else if (tgUpdate.message) {
      msgId = tgUpdate.message.message_id;
    }
  } catch(e) {}
  if (msgId) {
    try {
      Api.deleteMessage({ chat_id: chat.chatid, message_id: msgId });
    } catch(e) {}
  }
}

// FIX #18: Answer all callback queries immediately to dismiss
// the loading spinner that appears on inline buttons after tap.
try {
  if (tgUpdate.callback_query && tgUpdate.callback_query.id) {
    Api.answerCallbackQuery({
      callback_query_id: tgUpdate.callback_query.id
    });
  }
} catch(e) {}

// FIX #3: Admin file_id capture uses tgUpdate.message (not request).
// Safely guards every property access with a try/catch.
if (isAdmin()) {
  var fileId = "";
  var type   = "";
  try {
    var msg = tgUpdate.message;
    if (msg) {
      if (msg.photo && msg.photo.length > 0) {
        fileId = msg.photo[msg.photo.length - 1].file_id;
        type   = "📸 Photo";
      } else if (msg.video) {
        fileId = msg.video.file_id;
        type   = "🎥 Video";
      } else if (msg.document) {
        fileId = msg.document.file_id;
        type   = "📄 Document";
      } else if (msg.audio) {
        fileId = msg.audio.file_id;
        type   = "🎵 Audio";
      }
    }
  } catch(e) {}
  
  // FIXED: Reverted to Api.sendMessage with HTML formatting for mono tap-to-copy
  if (fileId) {
    try {
      Api.sendMessage({
        chat_id: chat.chatid,
        text: "✅ <b>" + type + " Captured!</b>\nTap the ID below to copy:\n\n<code>" + fileId + "</code>",
        parse_mode: "HTML"
      });
    } catch(e) {}
  }
}

      
