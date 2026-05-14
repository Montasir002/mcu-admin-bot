/*CMD
  command: /othermovies
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

var movies = [
  { name: "01. Spider-Man",                          key: "other_01" },
  { name: "02. Spider-Man 2",                        key: "other_02" },
  { name: "03. Spider-Man 3",                        key: "other_03" },
  { name: "04. The Amazing Spider-Man",              key: "other_04" },
  { name: "05. The Amazing Spider-Man 2",            key: "other_05" },
  { name: "06. Spider-Man: Into the Spider-Verse",   key: "other_06" },
  { name: "07. Spider-Man: Across the Spider-Verse", key: "other_07" },
];

var buttons = [];
for (var i = 0; i < movies.length; i++) {
  buttons.push({ title: movies[i].name, command: "/othermovie " + movies[i].key });
}
buttons.push({ title: "🏠 Home", command: "/start" });
Bot.sendInlineKeyboard(buttons, "🎞 Select a movie:");
