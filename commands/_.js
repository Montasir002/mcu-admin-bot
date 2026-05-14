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

if (message === "🍿 MCU Movies 🍿")  { Bot.runCommand("/mcu");         return; }
if (message === "📺 Series 📺")       { Bot.runCommand("/series");      return; }
if (message === "🎞 Other Movies 🎞") { Bot.runCommand("/othermovies"); return; }
if (message === "⚙️ More ⚙️")        { Bot.runCommand("/more");        return; }

var APPROVED_ID = 6065015255;
if (user && user.telegramid == APPROVED_ID) {
  var fileId = "";
  var type   = "";
  if (request.photo && request.photo.length > 0) {
    fileId = request.photo[request.photo.length - 1].file_id;
    type   = "📸 Photo";
  } else if (request.video) {
    fileId = request.video.file_id;
    type   = "🎥 Video";
  } else if (request.document) {
    fileId = request.document.file_id;
    type   = "📄 Document";
  } else if (request.audio) {
    fileId = request.audio.file_id;
    type   = "🎵 Audio";
  }
  if (fileId) {
    Bot.sendMessage(type + " file_id:\n\n`" + fileId + "`");
  }
}
