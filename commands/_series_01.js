/*CMD
  command: /series_01
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
  command: /series_01
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  aliases: 
  group: 
CMD*/

var seriesKey  = "series_01";
var seriesName = "WandaVision";
var posterUrl  = "https://image.tmdb.org/t/p/original/frobUz2X5Pc8OiVZU8Oo5K3NKMM.jpg";

var seasons = [
  { key: "s1", label: "Season 1" }
];

// FIX #3: Use tgUpdate (not deprecated request)
var msgId = null;
try {
  if (tgUpdate.callback_query) {
    msgId = tgUpdate.callback_query.message.message_id;
  } else if (tgUpdate.message) {
    msgId = tgUpdate.message.message_id;
  }
} catch(e) {}
if (msgId) {
  try { Api.deleteMessage({ chat_id: chat.chatid, message_id: msgId }); } catch(e) {}
}

// FIX #5 + #6: Delete any lingering series photo using series-scoped key
var oldPhotoId = User.getProperty("series_photo_msg_id_" + seriesKey);
if (oldPhotoId) {
  try { Api.deleteMessage({ chat_id: chat.chatid, message_id: oldPhotoId }); } catch(e) {}
  User.setProperty("series_photo_msg_id_" + seriesKey, 0, "integer");
}

// Send series poster and store its message_id
var photoResult = Api.sendPhoto({
  chat_id:    chat.chatid,
  photo:      posterUrl,
  caption:    "<b>" + seriesName + "</b>",
  parse_mode: "HTML"
});

// FIX #6: Series-scoped key prevents race condition
if (photoResult && photoResult.result) {
  User.setProperty("series_photo_msg_id_" + seriesKey,
    photoResult.result.message_id, "integer");
}

// Build season keyboard (2 buttons per row)
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
  { text: "🏠 Home", callback_data: "/start"  }
]);

Api.sendMessage({
  chat_id:      chat.chatid,
  text:         "⬇️ Select a season:",
  reply_markup: { inline_keyboard: seasonRows }
});
