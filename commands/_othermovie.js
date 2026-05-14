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

if (!params) { return; }

var f = Bot.getProp(params);
if (!f) { return Bot.sendMessage("❌ Not found: " + params); }
if (typeof f === "string") {
  try { f = JSON.parse(f); } catch(e) { return Bot.sendMessage("❌ JSON Error"); }
}

safeDelete();

Api.sendPhoto({
  chat_id:    chat.chatid,
  photo:      f.poster_url,
  caption:    f.caption,
  parse_mode: "HTML"
});

Api.sendDocument({
  chat_id:  chat.chatid,
  document: f.movie_file_id.replace(/\s/g, ""),
  reply_markup: {
    inline_keyboard: [[
      { text: "◀️ Back", callback_data: "/othermovies" },
      { text: "🏠 Home", callback_data: "/start" }
    ]]
  }
});
