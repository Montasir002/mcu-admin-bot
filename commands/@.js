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

var ADMIN_ID = 6065015255;

function isAdmin() {
  return user && user.telegramid == ADMIN_ID;
}

function requireAdmin() {
  if (!isAdmin()) { Bot.sendMessage("🚫 Admin only."); return false; }
  return true;
}

function safeDelete() {
  var msgId = null;
  try { msgId = request.message.message_id; } catch(e) {}
  if (msgId) {
    Api.deleteMessage({
      chat_id:    chat.chatid,
      message_id: msgId
    });
  }
}
