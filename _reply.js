/*CMD
  command: /reply
  help: Send a message to a user (admin only)
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

// FEATURE #3: Admin direct reply command
// USAGE: /reply [userID] [your message text]
// Example: /reply 123456789 Hello, how can I help you?
var ADMIN_ID = 6065015255;

if (!user || user.telegramid != ADMIN_ID) {
  Bot.sendMessage("🚫 Admin only.");
  return;
}

if (!params) {
  Bot.sendMessage(
    "⚠️ Usage: /reply [userID] [message text]\n" +
    "Example: /reply 123456789 Hello there!"
  );
  return;
}

// Split: first token is userID, remainder is the message
var spaceIdx  = params.indexOf(" ");
if (spaceIdx === -1) {
  Bot.sendMessage(
    "⚠️ No message text found.\n" +
    "Usage: /reply [userID] [message text]"
  );
  return;
}

var targetId  = params.substring(0, spaceIdx).trim();
var replyText = params.substring(spaceIdx + 1).trim();

if (!targetId || !replyText) {
  Bot.sendMessage("⚠️ Invalid format. Usage: /reply [userID] [message text]");
  return;
}

// Send reply to user
var result = Api.sendMessage({
  chat_id:    parseInt(targetId),
  parse_mode: "HTML",
  text:
    "📩 <b>Message from Admin:</b>\n\n" +
    "<blockquote>" + replyText + "</blockquote>\n\n" +
    "💬 You can reply using the button below.",
  reply_markup: {
    inline_keyboard: [[
      { text: "📩 Reply to Admin", callback_data: "/contact" },
      { text: "🏠 Home",           callback_data: "/start"   }
    ]]
  }
});

// Confirm to admin
if (result && (result.ok === true || result.message_id)) {
  Bot.sendMessage("✅ Reply sent to user ID: " + targetId);
} else {
  Bot.sendMessage(
    "❌ Failed to send. " +
    "User may have blocked the bot or ID is invalid."
  );
}
