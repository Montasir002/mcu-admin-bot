/*CMD
  command: sendEpisodeHelper
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
  command: sendEpisodeHelper
  need_reply: false
CMD*/

// BUG #1 FIX: Staggered delivery companion command.
// Called via Bot.run with run_after delay — each episode
// arrives as a separate chat bubble instead of a merged stack.

var fileId  = options && options.file_id  ? options.file_id  : null;
var caption = options && options.caption  ? options.caption  : null;

if (!fileId) { return; }

// Strip stray backticks or whitespace from file_id
fileId = fileId.replace(/[`\s]/g, "");
if (!fileId) { return; }

var sendParams = {
  chat_id:  chat.chatid,
  document: fileId
};

if (caption) {
  sendParams.caption    = caption;
  sendParams.parse_mode = "HTML";
}

try { Api.sendDocument(sendParams); } catch(e) {}
