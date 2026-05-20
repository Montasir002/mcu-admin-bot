/*CMD
  command: sendSeasonFooter
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
  command: sendSeasonFooter
  need_reply: false
CMD*/

// Companion to sendEpisodeHelper.
// Sends Back and Home navigation after all staggered episodes deliver.
var seriesKey = options && options.series_key ? options.series_key : "";

Api.sendMessage({
  chat_id: chat.chatid,
  text:    "✅ All episodes sent! Thank you for using this bot 💖",
  reply_markup: {
    inline_keyboard: [[
      { text: "◀️ Back", callback_data: "/" + seriesKey },
      { text: "🏠 Home", callback_data: "/start" }
    ]]
  }
});
