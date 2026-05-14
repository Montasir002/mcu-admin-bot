/*CMD
  command: /series_dd
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

var seriesKey  = "series_dd";
var seriesName = "Daredevil";
var posterUrl  = "https://image.tmdb.org/t/p/original/QWbPaDxiB6LW2LjASknzYBvjMj.jpg";

var seasons = [
  { key:"s1", label:"Season 1" },
  { key:"s2", label:"Season 2" },
  { key:"s3", label:"Season 3" }
];

// Delete previous menu message
var msgId = null;
if (request.callback_query) {
  msgId = request.callback_query.message.message_id;
} else if (request.message) {
  msgId = request.message.message_id;
}

if (msgId) {
  try { Api.deleteMessage({ chat_id: chat.chatid, message_id: msgId }); } catch(e) {}
}

// Send series poster and store its ID
var photoResult = Api.sendPhoto({
  chat_id:    chat.chatid,
  photo:      posterUrl,
  caption:    "<b>" + seriesName + "</b>",
  parse_mode: "HTML"
});

if(photoResult && photoResult.result){
  User.setProperty("series_photo_msg_id", photoResult.result.message_id, "integer");
}

// Build season keyboard
var total      = seasons.length;
var seasonRows = [];
for (var i = 0; i < total; i += 2) {
  if (i + 1 < total) {
    seasonRows.push([
      { text: seasons[i].label,   callback_data: "/season " + seriesKey + "|" + seasons[i].key   },
      { text: seasons[i+1].label, callback_data: "/season " + seriesKey + "|" + seasons[i+1].key }
    ]);
  } else {
    seasonRows.push([
      { text: seasons[i].label, callback_data: "/season " + seriesKey + "|" + seasons[i].key }
    ]);
  }
}
seasonRows.push([
  { text: "◀️ Back", callback_data: "/series" },
  { text: "🏠 Home",  callback_data: "/start"  }
]);

Api.sendMessage({
  chat_id:      chat.chatid,
  text:         "⬇️ Select a season:",
  reply_markup: { inline_keyboard: seasonRows }
});

