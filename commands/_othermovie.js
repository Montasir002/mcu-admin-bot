/*CMD
  command: /othermovie
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
  command: /othermovie
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  aliases: 
  group: 
CMD*/

if (!params) { return; }

// FIX #7: Double-tap lock
var lockKey = "othermovie_lock_" + user.telegramid;
if (Bot.getProp(lockKey)) { return; }
Bot.setProp(lockKey, "1");

var f = Bot.getProp(params);

// FIX #9: Missing prop — return error with navigation
if (!f) {
  Bot.setProp(lockKey, "");
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "❌ Content not found. Please try again.",
    reply_markup: {
      inline_keyboard: [[
        { text: "◀️ Back", callback_data: "/othermovies" },
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
          { text: "◀️ Back", callback_data: "/othermovies" },
          { text: "🏠 Home", callback_data: "/start" }
        ]]
      }
    });
    return;
  }
}

safeDelete();

// FIX #2: Strip backticks and whitespace from file_id
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
      { text: "◀️ Back", callback_data: "/othermovies" },
      { text: "🏠 Home", callback_data: "/start" }
    ]]
  }
});

Bot.setProp(lockKey, "");
