/*CMD
  command: /admin
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
  command: /admin
  need_reply: false
CMD*/

// FEATURE #4: Admin Control Panel — gated behind isAdmin()
var ADMIN_ID = 6065015255;

if (!user || user.telegramid != ADMIN_ID) {
  Bot.sendMessage("🚫 Admin only.");
  return;
}

var guide =
  "🛠️ <b>MCU Bot — Admin Control Panel</b>\n\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━\n" +
  "📡 <b>BROADCAST GUIDE</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━\n" +
  "1. BB App — Your Bot — Chats dashboard\n" +
  "2. Tap Broadcast at the top right\n" +
  "3. Type your message in the text box\n" +
  "4. Select target: All Users or filter by group\n" +
  "5. Tap Send — delivery is automatic\n\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━\n" +
  "⚙️ <b>QUICK COMMANDS</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━\n" +
  "<code>/reply [userID] [message]</code>\n" +
  "Send a direct reply to any user\n\n" +
  "<code>/admin</code>\n" +
  "Show this control panel\n\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━\n" +
  "📦 <b>PROPERTY MANAGEMENT</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━\n" +
  "Movie keys: <code>mcu_01</code> through <code>mcu_37</code>\n" +
  "Series keys: <code>series_dd_s1</code>, <code>series_01_s1</code>\n" +
  "All property types must be set to: <b>JSON</b>\n\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━\n" +
  "📊 <b>CHATS DASHBOARD</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━━\n" +
  "BB App — Your Bot — Chats\n" +
  "View all users, search by ID or username\n" +
  "Tap any user to view their stored properties\n" +
  "Use Block to remove abusive users\n\n" +
  "💡 <b>Tip:</b> Use BJS Generator v5 to produce\n" +
  "property JSON and command code without\n" +
  "writing anything manually.";

Api.sendMessage({
  chat_id:    chat.chatid,
  parse_mode: "HTML",
  text:       guide,
  reply_markup: {
    inline_keyboard: [
      [{ text: "📡 BB Docs", url: "https://bots.business/docs" }],
      [{ text: "🏠 Home",    callback_data: "/start" }]
    ]
  }
});
