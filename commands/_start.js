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
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  aliases: 
  group: 
CMD*/

// FIX #8: Clean up any lingering inline menu message when user
// returns home, so dead inline keyboards don't accumulate in chat.
var lastMenuId = User.getProperty("last_menu_msg_id");
if (lastMenuId) {
  try {
    Api.deleteMessage({ chat_id: chat.chatid, message_id: lastMenuId });
  } catch(e) {}
  User.setProperty("last_menu_msg_id", 0, "integer");
}

Api.sendMessage({
  chat_id: chat.chatid,
  text: "💖 Welcome to Marvel World 💖\n\nYou can download all MCU Movies and Series from here.\n\n✅ Select your choice.",
  reply_markup: {
    keyboard: [
      ["🍿 MCU Movies 🍿", "📺 Series 📺"],
      ["🎞 Other Movies 🎞"],
      ["⚙️ More ⚙️"]
    ],
    resize_keyboard:   true,
    one_time_keyboard: false
  }
});
