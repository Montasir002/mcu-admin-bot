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
  need_reply: false
CMD*/

if (!params) { return; }

// Double-tap lock — prevents duplicate episode delivery
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

// Error: prop missing — return with navigation buttons intact
if (!raw) {
  Bot.setProp(lockKey, "");
  Api.sendMessage({
    chat_id: chat.chatid,
    text:    "❌ Season data not found. Please contact admin.",
    reply_markup: { inline_keyboard: [[
      { text: "◀️ Back", callback_data: "/" + seriesKey },
      { text: "🏠 Home", callback_data: "/start" }
    ]]}
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
    text:    "❌ Data error for " + propKey + ". Please contact admin.",
    reply_markup: { inline_keyboard: [[
      { text: "◀️ Back", callback_data: "/" + seriesKey },
      { text: "🏠 Home", callback_data: "/start" }
    ]]}
  });
  return;
}

// ── CLEANUP ────────────────────────────────────────
// BUG #3 + FEATURE #1: Delete season selector via tgUpdate
var currentMsgId = null;
try {
  if (tgUpdate.callback_query) {
    currentMsgId = tgUpdate.callback_query.message.message_id;
  } else if (tgUpdate.message) {
    currentMsgId = tgUpdate.message.message_id;
  }
} catch(e) {}
if (currentMsgId) {
  try {
    Api.deleteMessage({ chat_id: chat.chatid, message_id: currentMsgId });
  } catch(e) {}
}

// BUG #3 FIX: Delete series poster using series-scoped key
var photoMsgId = User.getProperty("series_photo_msg_id_" + seriesKey);
if (photoMsgId) {
  try {
    Api.deleteMessage({ chat_id: chat.chatid, message_id: photoMsgId });
  } catch(e) {}
  User.setProperty("series_photo_msg_id_" + seriesKey, 0, "integer");
}

// ── POSTER ─────────────────────────────────────────
var poster  = season.poster_url || "";
var caption =
  "<b>" + (season.series_name    || "") + "</b>\n\n" +
  "Season: "    + (season.season_number  || "") + "\n" +
  "Episodes: "  + (season.total_episodes || "") + "\n" +
  "Released: "  + (season.released       || "") + "\n" +
  "Languages: " + (season.languages      || "");

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

// ── STAGGERED EPISODE DELIVERY (BUG #1 FIX) ───────
// Bot.run queues each episode with a progressive delay.
// Telegram receives them one at a time — no merged stacking.
var episodes = season.episodes      || {};
var total    = season.total_episodes || 0;
var delay    = 1.5;

// COMPLIANCE: i !== total + 1 — no raw < in loop
var i = 1;
while (i !== total + 1) {
  var rawId  = episodes["e" + i] || "";
  var fileId = rawId.replace(/[`\s]/g, "");
  if (fileId) {
    Bot.run({
      command:   "sendEpisodeHelper",
      options:   {
        file_id: fileId,
        caption: "Episode " + i,
        ep_num:  i
      },
      run_after: delay
    });
    delay += 1.5;
  }
  i += 1;
}

// Queue footer after all episodes — 1s buffer after last delay
var footerDelay = delay + 1;
Bot.run({
  command:   "sendSeasonFooter",
  options:   { series_key: seriesKey },
  run_after: footerDelay
});

// Release lock immediately — sending is async via Bot.run
Bot.setProp(lockKey, "");
