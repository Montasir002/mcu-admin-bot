/*CMD
  command: /morebots
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
  command: /morebots
  need_reply: false
CMD*/

// FEATURE #2: More Bots inline keyboard with URL buttons
Api.sendMessage({
  chat_id:    chat.chatid,
  parse_mode: "HTML",
  text: "🤖 <b>Our Other Bots</b>\n\nExplore our other projects below! 👇",
  reply_markup: {
    inline_keyboard: [
      [{ text: "DC Movies", url: "https://t.me/Marvel_movies0_bot" }],
      [{ text: "Ben 10 Series", url: "https://t.me/Ben_10_fan_bot" }],
      [{ text: "🏠 Home", callback_data: "/start" }]
    ]
  }
});
