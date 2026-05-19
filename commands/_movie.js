/*CMD
  command: /movie
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
  command: /movie
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  aliases: 
  group: 
CMD*/

if (!params) { return; }

// FIX #7: Double-tap lock — prevent sending duplicate content
// if user taps the same button twice quickly.
var lockKey = "movie_lock_" + user.telegramid;
if (Bot.getProp(lockKey)) { return; }
Bot.setProp(lockKey, "1");

var f = Bot.getProp(params);

// FIX #9: If prop is missing, show error WITH navigation buttons
// so user is never stranded without a menu.
if (!f) {
  Bot.setProp(lockKey, "");
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "❌ Content not found. Please try again.",
    reply_markup: {
      inline_keyboard: [[
        { text: "◀️ Back", callback_data: "/mcu" },
        { text: "🏠 Home", callback_data: "/start" }
      ]]
    }
  });
  return;
}

if (typeof f === "string") {
  try {
    f = JSON.parse(f);
  } catch(e) {
    Bot.setProp(lockKey, "");
    Api.sendMessage({
      chat_id: chat.chatid,
      text: "❌ Data error. Please contact admin.",
      reply_markup: {
        inline_keyboard: [[
          { text: "◀️ Back", callback_data: "/mcu" },
          { text: "🏠 Home", callback_data: "/start" }
        ]]
      }
    });
    return;
  }
}

// Delete the movie list menu message
safeDelete();

// FIX #2: Strip backticks and whitespace from file_id before sending
var cleanFileId = (f.movie_file_id || "").replace(/[`\s]/g, "");

Api.sendPhoto({
  chat_id:    chat.chatid,
  photo:      f.poster_url,
  caption:    f.caption,
  parse_mode: "HTML"
});

Api.sendDocument({
  chat_id:  chat.chatid,
  document: cleanFileId,
  reply_markup: {
    inline_keyboard: [[
      { text: "◀️ Back", callback_data: "/mcu" },
      { text: "🏠 Home", callback_data: "/start" }
    ]]
  }
});

// Release lock after sending
Bot.setProp(lockKey, "");
