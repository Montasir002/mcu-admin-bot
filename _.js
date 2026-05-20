/*CMD
  command: *
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
  command: *
  need_reply: false
CMD*/

// Reply keyboard routing
if (message === "🍿 MCU Movies 🍿")  { Bot.runCommand("/mcu");         return; }
if (message === "📺 Series 📺")       { Bot.runCommand("/series");      return; }
if (message === "🎞 Other Movies 🎞") { Bot.runCommand("/othermovies"); return; }
// FEATURE #2: New split buttons
if (message === "🤖 More Bots")       { Bot.runCommand("/morebots");    return; }
if (message === "📩 Contact Admin")   { Bot.runCommand("/contact");     return; }
