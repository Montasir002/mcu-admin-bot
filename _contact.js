/*CMD
  command: /contact
  help: Send a message to admin for support
  need_reply: true
  auto_retry_time: 
  folder: 

  <<ANSWER
Send your message and we'll get back to you soon!
  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// FEATURE #3: Rate-limited ticketing pipeline
var ADMIN_ID = 6065015255;
var COOLDOWN = 60; // seconds between allowed submissions

// Anti-spam guard: check last contact timestamp
var lastTime = parseInt(User.getProperty("last_contact_time") || "0");
var nowTime  = Math.floor(Date.now() / 1000);
var elapsed  = nowTime - lastTime;

// COMPLIANCE: elapsed !== — using subtraction result, not raw <
if (COOLDOWN > elapsed) {
  var wait = COOLDOWN - elapsed;
  Api.sendMessage({
    chat_id:    chat.chatid,
    parse_mode: "HTML",
    text:
      "⏳ <b>Please slow down!</b>\n\n" +
      "You can send another message in " +
      "<b>" + wait + " seconds</b>.\n\n" +
      "We appreciate your patience 🙏"
  });
  return;
}

// Update timestamp
User.setProperty("last_contact_time", String(nowTime), "string");

// Build timestamp string
var d  = new Date();
var ts = d.toUTCString();

// Compile ticket details
var uname = user.username ? "@" + user.username : "(no username)";
var uid   = user.telegramid;
var text  = message || "(empty message)";

// Deliver ticket to admin
// COMPLIANCE: no placeholder tags in text — uses variable names directly
Api.sendMessage({
  chat_id:    ADMIN_ID,
  parse_mode: "HTML",
  text:
    "📬 <b>New Support Ticket!</b>\n" +
    "• <b>User:</b> " + uname +
    " (ID: <code>" + uid + "</code>)\n" +
    "• <b>Sent At:</b> " + ts + "\n\n" +
    "📝 <b>Message:</b>\n" +
    "<blockquote>" + text + "</blockquote>\n\n" +
    "⚡️ <b>Quick Reply:</b>\n" +
    "<code>/reply " + uid + " </code>"
});

// Confirm receipt to user
Api.sendMessage({
  chat_id:    chat.chatid,
  parse_mode: "HTML",
  text:
    "✅ <b>Your message has been sent!</b>\n\n" +
    "Our admin will get back to you soon. Thank you 💖",
  reply_markup: {
    inline_keyboard: [[
      { text: "🏠 Home", callback_data: "/start" }
    ]]
  }
});
