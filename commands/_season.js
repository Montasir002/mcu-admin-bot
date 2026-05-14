/*CMD
  command: /season
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

var parts     = params.split("|");
var seriesKey = parts[0];
var seasonKey = parts[1];
var propKey   = seriesKey + "_" + seasonKey;

var raw = Bot.getProp(propKey);
if (!raw) { return Bot.sendMessage("❌ Not found: " + propKey); }

var season;
try {
  season = (typeof raw === "string") ? JSON.parse(raw) : raw;
} catch(e) { return Bot.sendMessage("❌ JSON Error: " + propKey); }

// --- CLEANUP ---
// 1. Delete the "Select a season" message
var currentMsgId = null;
try { 
  if (request.callback_query) { currentMsgId = request.callback_query.message.message_id; }
  else if (request.message) { currentMsgId = request.message.message_id; }
} catch(e) {}

if (currentMsgId) {
  try { Api.deleteMessage({ chat_id: chat.chatid, message_id: currentMsgId }); } catch(e) {}
}

// 2. Delete the stored Series Poster (the photo from /series_xx)
var photoMsgId = User.getProperty("series_photo_msg_id");
if (photoMsgId) {
  try {
    Api.deleteMessage({ chat_id: chat.chatid, message_id: photoMsgId });
    User.setProperty("series_photo_msg_id", 0, "integer"); // Clear memory
  } catch(e) {}
}
// --- END CLEANUP ---

// Poster setup
var poster = season.poster_url || "";
if (!poster) {
  var mainRaw = Bot.getProp(seriesKey + "_main");
  if (mainRaw) {
    var mainData = (typeof mainRaw === "string") ? JSON.parse(mainRaw) : mainRaw;
    poster = mainData.poster_url || "";
  }
}

var caption =
  "<b>" + season.series_name + "</b>\n\n" +
  "Season: "    + season.season_number  + "\n" +
  "Episodes: "  + season.total_episodes + "\n" +
  "Released: "  + season.released       + "\n" +
  "Languages: " + season.languages;

Api.sendPhoto({
  chat_id:    chat.chatid,
  photo:      poster,
  caption:    caption,
  parse_mode: "HTML"
});

var episodes = season.episodes;
for (var ek in episodes) {
  if (episodes[ek] && episodes[ek].trim() !== "") {
    Api.sendDocument({
      chat_id:  chat.chatid,
      document: episodes[ek].trim()
    });
  }
}

Api.sendMessage({
  chat_id: chat.chatid,
  text:    "Thank you for using this bot 💖",
  reply_markup: {
    inline_keyboard: [[
      { text: "◀️ Back", callback_data: "/" + seriesKey },
      { text: "🏠 Home", callback_data: "/start" }
    ]]
  }
});

