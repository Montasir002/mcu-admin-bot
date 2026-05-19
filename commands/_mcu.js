/*CMD
  command: /mcu
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
  command: /mcu
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  aliases: 
  group: 
CMD*/

var movies = [
  { name: "01. Iron Man",                                    key: "mcu_01" },
  { name: "02. The Incredible Hulk",                         key: "mcu_02" },
  { name: "03. Iron Man 2",                                  key: "mcu_03" },
  { name: "04. Thor",                                        key: "mcu_04" },
  { name: "05. Captain America: The First Avenger",          key: "mcu_05" },
  { name: "06. The Avengers",                                key: "mcu_06" },
  { name: "07. Iron Man 3",                                  key: "mcu_07" },
  { name: "08. Thor: The Dark World",                        key: "mcu_08" },
  { name: "09. Captain America: The Winter Soldier",         key: "mcu_09" },
  { name: "10. Guardians of the Galaxy",                     key: "mcu_10" },
  { name: "11. Avengers: Age of Ultron",                     key: "mcu_11" },
  { name: "12. Ant-Man",                                     key: "mcu_12" },
  { name: "13. Captain America: Civil War",                  key: "mcu_13" },
  { name: "14. Doctor Strange",                              key: "mcu_14" },
  { name: "15. Guardians of the Galaxy Vol. 2",              key: "mcu_15" },
  { name: "16. Spider-Man: Homecoming",                      key: "mcu_16" },
  { name: "17. Thor: Ragnarok",                              key: "mcu_17" },
  { name: "18. Black Panther",                               key: "mcu_18" },
  { name: "19. Avengers: Infinity War",                      key: "mcu_19" },
  { name: "20. Ant-Man and the Wasp",                        key: "mcu_20" },
  { name: "21. Captain Marvel",                              key: "mcu_21" },
  { name: "22. Avengers: Endgame",                           key: "mcu_22" },
  { name: "23. Spider-Man: Far From Home",                   key: "mcu_23" },
  { name: "24. Black Widow",                                 key: "mcu_24" },
  { name: "25. Shang-Chi and the Legend of the Ten Rings",   key: "mcu_25" },
  { name: "26. Eternals",                                    key: "mcu_26" },
  { name: "27. Spider-Man: No Way Home",                     key: "mcu_27" },
  { name: "28. Doctor Strange in the Multiverse of Madness", key: "mcu_28" },
  { name: "29. Thor: Love and Thunder",                      key: "mcu_29" },
  { name: "30. Black Panther: Wakanda Forever",              key: "mcu_30" },
  { name: "31. Ant-Man and the Wasp: Quantumania",           key: "mcu_31" },
  { name: "32. Guardians of the Galaxy Vol. 3",              key: "mcu_32" },
  { name: "33. The Marvels",                                 key: "mcu_33" },
  { name: "34. Deadpool & Wolverine",                        key: "mcu_34" },
  { name: "35. Captain America: Brave New World",            key: "mcu_35" },
  { name: "36. Thunderbolts*",                               key: "mcu_36" },
  { name: "37. The Fantastic Four: First Steps",             key: "mcu_37" },
  { name: "★ Werewolf by Night",                             key: "mcu_sp1" },
  { name: "★ Guardians Holiday Special",                     key: "mcu_sp2" },
];

var buttons = [];
for (var i = 0; i < movies.length; i++) {
  buttons.push({ title: movies[i].name, command: "/movie " + movies[i].key });
}
buttons.push({ title: "🏠 Home", command: "/start" });

// FIX #8: Store the sent menu message_id so /start can clean it up
var menuResult = Bot.sendInlineKeyboard(buttons, "🍿 Select a movie:");
if (menuResult && menuResult.result) {
  User.setProperty("last_menu_msg_id", menuResult.result.message_id, "integer");
}
