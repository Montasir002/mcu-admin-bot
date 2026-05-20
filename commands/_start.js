/*CMD
  command: /start
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
  command: /start
  need_reply: false
CMD*/

// Clean up any lingering inline menu on home navigation
var lastMenuId = User.getProperty("last_menu_msg_id");
if (lastMenuId) {
  try {
    Api.deleteMessage({ chat_id: chat.chatid, message_id: lastMenuId });
  } catch(e) {}
  User.setProperty("last_menu_msg_id", 0, "integer");
}

// FEATURE #2: Split keyboard — More Bots and Contact Admin as separate buttons
Api.sendMessage({
  chat_id: chat.chatid,
  text: "💖 Welcome to Marvel World 💖\n\nDownload all MCU Movies and Series here.\n\n✅ Select your choice.",
  reply_markup: {
    keyboard: [
      ["🍿 MCU Movies 🍿", "📺 Series 📺"],
      ["🎞 Other Movies 🎞"],
      ["🤖 More Bots", "📩 Contact Admin"]
    ],
    resize_keyboard:   true,
    one_time_keyboard: false
  }
});
