/*CMD
  command: /series
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

var series = [
  { name: "Daredevil",                               key: "series_dd"  },
  { name: "Daredevil: Born Again",                   key: "series_dba" },
  { name: "WandaVision",                             key: "series_01"  },
  { name: "The Falcon and the Winter Soldier",       key: "series_02"  },
  { name: "Loki",                                    key: "series_03"  },
  { name: "What If...?",                             key: "series_04"  },
  { name: "Hawkeye",                                 key: "series_05"  },
  { name: "Moon Knight",                             key: "series_06"  },
  { name: "Ms. Marvel",                              key: "series_07"  },
  { name: "She-Hulk: Attorney at Law",               key: "series_08"  },
  { name: "Secret Invasion",                         key: "series_09"  },
  { name: "Echo",                                    key: "series_10"  },
  { name: "Agatha All Along",                        key: "series_11"  },
  { name: "Your Friendly Neighborhood Spider-Man",   key: "series_12"  },
  { name: "Ironheart",                               key: "series_13"  },
  { name: "Eyes of Wakanda",                         key: "series_14"  },
  { name: "Marvel Zombies",                          key: "series_15"  },
  { name: "Wonder Man",                              key: "series_16"  },
];

var buttons = [];
for (var i = 0; i < series.length; i++) {
  buttons.push({ title: series[i].name, command: "/" + series[i].key });
}
buttons.push({ title: "🏠 Home", command: "/start" });
Bot.sendInlineKeyboard(buttons, "📺 Select a series:");
