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
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  aliases: 
  group: 
CMD*/

// Reply keyboard button routing
if (message === "🍿 MCU Movies 🍿")  { Bot.runCommand("/mcu");         return; }
if (message === "📺 Series 📺")       { Bot.runCommand("/series");      return; }
if (message === "🎞 Other Movies 🎞") { Bot.runCommand("/othermovies"); return; }
if (message === "⚙️ More ⚙️")        { Bot.runCommand("/more");        return; }
