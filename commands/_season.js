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

/*CMD
  command: /season
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  aliases: 
  group: 
CMD*/

if (!params) { return; }

// FIX #7: Double-tap lock — prevents sending all episodes twice
// if user taps a season button twice quickly.
var lockKey = "season_lock_" + user.telegramid;
if (Bot.getProp(lockKey)) { return; }
Bot.setProp(lockKey, "1");

var parts     = params.split("|");
var seriesKey = parts[0];
var seasonKey = parts[1];

if (!seriesKey || !seasonKey) {
  Bot.setProp(lockKey, "");
  return;
}

var propKey = seriesKey + "_" + seasonKey;
var raw     = Bot.getProp(propKey);

// FIX #9: Missing prop — return error WITH navigation buttons
if (!raw) {
  Bot.setProp(lockKey, "");
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "❌ Season data not found. Please contact admin.",
    reply_markup: {
      inline_keyboard: [[
        { text: "◀️ Back", callback_data: "/" + seriesKey },
        { text: "🏠 Home", callback_data: "/start" }
      ]]
    }
  });
  return;
}

var season;
try {
  season = (typeof raw === "string") ? JSON.parse(raw) : raw;
} catch(e) {
  Bot.setProp(lockKey, "");
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "❌ Data error for " + propKey + ". Please contact admin.",
    reply_markup: {
      inline_keyboard: [[
        { text: "◀️ Back", callback_data: "/" + seriesKey },
        { text: "🏠 Home", callback_data: "/start" }
      ]]
    }
  });
  return;
}

// ── CLEANUP ─────────────────────────────────────────────────

// FIX #3: Use tgUpdate (not deprecated request) to get message_id
var currentMsgId = null;
try {
  if (tgUpdate.callback_query) {
    currentMsgId = tgUpdate.callback_query.message.message_id;
  } else if (tgUpdate.message) {
    currentMsgId = tgUpdate.message.message_id;
  }
} catch(e) {}

// Delete the "Select a season" menu message
if (currentMsgId) {
  try { Api.deleteMessage({ chat_id: chat.chatid, message_id: currentMsgId }); } catch(e) {}
}

// FIX #5 + #6: Delete the series poster using series-scoped key
var photoMsgId = User.getProperty("series_photo_msg_id_" + seriesKey);
if (photoMsgId) {
  try {
    Api.deleteMessage({ chat_id: chat.chatid, message_id: photoMsgId });
  } catch(e) {}
  User.setProperty("series_photo_msg_id_" + seriesKey, 0, "integer");
}

// ── POSTER ──────────────────────────────────────────────────

// Use season poster if available, fall back to series poster_url
// FIX #11: No Bot.getProp(_main) lookup needed — poster_url is
// already stored directly in each season property by the generator.
var poster = season.poster_url || "";

// ── CAPTION ─────────────────────────────────────────────────

var caption =
  "<b>" + (season.series_name || "") + "</b>\n\n" +
  "Season: "    + (season.season_number  || "") + "\n" +
  "Episodes: "  + (season.total_episodes || "") + "\n" +
  "Released: "  + (season.released       || "") + "\n" +
  "Languages: " + (season.languages      || "");

// Send the season poster with caption
if (poster) {
  Api.sendPhoto({
    chat_id:    chat.chatid,
    photo:      poster,
    caption:    caption,
    parse_mode: "HTML"
  });
} else {
  Api.sendMessage({
    chat_id:    chat.chatid,
    text:       caption,
    parse_mode: "HTML"
  });
}

// ── SEND EPISODES ────────────────────────────────────────────

// FIX #4: Use index-based loop (not for...in) to guarantee
// episodes are sent in correct order: e1, e2, e3 ... eN.
// FIX #2: Strip backticks and whitespace from every file_id.
// FIX #15: Send in batches of up to 10 using sendMediaGroup
// to reduce API calls and avoid flood limits.

var episodes   = season.episodes || {};
var total      = season.total_episodes || 0;
var batch      = [];

for (var i = 1; i <= total; i++) {
  var rawId  = episodes["e" + i] || "";
  var fileId = rawId.replace(/[`\s]/g, "");
  if (fileId) {
    batch.push({ type: "document", media: fileId });
  }
  // Send batch when it reaches 10 items or on the last episode
  if (batch.length === 10 || (i === total && batch.length > 0)) {
    try {
      Api.sendMediaGroup({
        chat_id: chat.chatid,
        media:   batch
      });
    } catch(e) {
      // Fallback: send individually if sendMediaGroup fails
      for (var b = 0; b < batch.length; b++) {
        try {
          Api.sendDocument({
            chat_id:  chat.chatid,
            document: batch[b].media
          });
        } catch(e2) {}
      }
    }
    batch = [];
  }
}

// ── FOOTER MESSAGE ───────────────────────────────────────────

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

// Release lock after all sending is complete
Bot.setProp(lockKey, "");
