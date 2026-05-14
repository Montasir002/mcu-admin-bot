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

Api.sendMessage({
  chat_id: chat.chatid,
  text: "💖 Welcome to Marvel World 💖\n\nYou can download all MCU Movies and Series from here.\n\n✅ Select your choice.",
  reply_markup: {
    keyboard: [
      ["🍿 MCU Movies 🍿", "📺 Series 📺"],
      ["🎞 Other Movies 🎞"],
      ["⚙️ More ⚙️"]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
});
