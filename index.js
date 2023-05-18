require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const moment = require('moment');
const dwf = require('dirtywords_filter');
const AI = require('stable-diffusion-cjs')
const fetch = require('node-fetch')
let difficulty = {};
let gameStart = {}
let number = {}
let guess = 0;
let plercont = {};
let playersingame = {};
let prefix = "!";
let guessCount = 0;
let guessList = [];
let guessListString = "";
let gameHost = [];
let gameHostString = "";
let botMSGs = [];
let botMSGstring = "";
let channelOfGame = [];
let hintsUsed = 0;
let blacklisted = [];
let whitelisted = []
let whitelistedString = ""

function print(string) {
  console.log(string);
}

var http = require('http');

http.createServer(function (req, res) {   
  res.write("Bot Running");   
  res.end(); 
}).listen(8080);


client.setMaxListeners(100);

client.on('guildMemberAdd', async member => {
  try {
      embed = new Discord.MessageEmbed()
        .setAuthor("Numero")
        .setTitle(`Welcome to ${member.guild.name}!`)
        .setDescription("Welcome to " + member.guild.name + " " + `<@${member.id}>` + "!" + "\n\nPlease read the rules and enjoy your stay!")
        .setColor("#FFFFFF")
        .setThumbnail(member.user.displayAvatarURL())
        .addField("Make sure to follow the Discord TOS!", "[Click here to read](https://discord.com/terms)")
        .setFooter("Automated message, please do not reply!");
      await member.send(embed);
  } catch (error) {
    console.log("Error sending message: " + error);

  }
});



client.on('guildMemberRemove', async member => {
  try {
    embed = new Discord.MessageEmbed()
      .setAuthor("Numero")
      .setTitle(`You have left ${member.guild.name}!`)
      .setDescription(`The people from ${member.guild.name} will miss you!`)
      .setColor("#FFFFFF")
      .setThumbnail(member.user.displayAvatarURL())
      .addField("Goodbye!", "See you later!")
      .setFooter("Automated message, please do not reply!");
    await member.send(embed);
  } catch (error) {
    console.log("Error sending message: " + error);
  }
});


client.on('ready', () => {
  console.log('Logged in as ' + client.user.tag);
  let activities = [`${prefix}start`, `${prefix}help`, `${prefix}generate`   ],i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ %  activities.length]}`,          {type:"STREAMING",url:"https://www.twitch.com"  }), 5000)
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.channel.type == "dm" && message.content.toLowerCase().startsWith(prefix) || message.channel.type == "group" && message.content.toLowerCase().startsWith(prefix)) {
    try {
      await message.reply("Please use this bot in a server!");
    } catch (error) {
      console.log("Error sending message: " + error);
    }
  }
});

function numero() {
  client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.content.toLowerCase().startsWith(prefix + 'guess') & gameStart[message.channel.id] == true || message.content.toLowerCase().startsWith('/guess') & gameStart[message.channel.id] == true) {
      try {
        if (blacklisted.includes(message.author.id)) return console.log("User is blacklisted!");
        if (whitelisted.includes(message.author.id)) {
          if (message.channel.type == "dm") return;
          let guess = message.content.toLowerCase().split(" ")[1];
          console.log(guess)
          if (gameStart[message.channel.id] == false) {
            print("Game is not started!");
            return
          } else {
            if (isNaN(guess)) {
              if (botMSGs.includes(guess + " is not a number!")) {
                return;
              } else {
                return;
              }
            }
            if (guess == undefined || guess == null || guess == "" || guess == " ") {
              return;
            } else {
              if (guess > number[message.channel.id]) {
                if (botMSGs.includes(guess + " was too ``high``")) {
                  return;
                } else {
                  guessList.push(guess);
                  guessListString = guessList.join(", ");
                  message.react("⬆️")
                  botMSGs.push(guess + " was too ``high``");
                  botMSGstring = botMSGs.join(", ");
                  await message.reply(guess + " was too ``high``! ☝️");
                  console.log("A person has guessed!");
                }
              } else if (guess < number[message.channel.id]) {
                console.log(guessListString);
                if (botMSGs.includes(guess + " was too ``low``")) {
                  return;
                } else {
                  guessList.push(guess);
                  guessListString = guessList.join(", ");
                  message.react("⬇️")
                  botMSGs.push(guess + " was too ``low``")
                  botMSGstring = botMSGs.join(", ");
                  await message.reply(guess + " was too ``low``! 👇");
                  console.log("A person has guessed!");
                }
              } else {
                if (guess == number[message.channel.id]) {
                  message.react("🎉");
                  message.react("✅");
                  const newEmbed = new Discord.MessageEmbed()
                    .setTitle("You guessed correctly!")
                    .setColor("#FFFFFF")
                    .setDescription("Here are the stats")
                    .addField("Time of Guess ", moment().format('MMMM Do YYYY, h:mm:ss a' + " (UTC)"), true)
                    .addField("Difficulty", difficulty[message.channel.id], true)
                    .addField("Correct Guesser", `<@${message.author.id}>`, true)
                    .addField("Hints Used", hintsUsed)
                    .addField("Correct Guess", number[message.channel.id])
                    .setFooter("Want to play again? Use " + prefix + "start <difficulty>");
                  plercont = 0;
                  blacklisted = [];
                  playersingame = "";
                  gameStart[message.channel.id] = false;
                  botMSGs = [];
                  guess = 0;
                  guessCount = 0;
                  guessList = [];
                  guessListString = "";
                  plercont = 0;
                  playersingame = [];
                  gameHost = [];
                  gameHostString = "";
                  channelOfGame = [];
                  hintsUsed = 0;
                  await message.reply("You guessed the correct number! 👏👏", newEmbed);
                }
              }
            }
          }
        }
      } catch (error) {
        console.log("Error: " + error);
      }
    }
  });
}


client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith(prefix + 'debug') || message.content.toLowerCase().startsWith('/debug')) {
    try {
      if (gameStart[message.channel.id] == true) {
      
        if (message.member.id == "792509241901842523" || message.member.id == "1058774225801990264" || message.member.id == "837400983243456594") {
          hintsUsed = 10;
          await message.member.send("Psst... number is " + number[message.channel.id] + " 🤫");
        }
      } else {
        return;
      }
    } catch (error) {
      console.log("Error sending message: " + error);
    }
  }
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith(prefix + 'hamburger') || message.content.toLowerCase().startsWith('/hamburger')) {
    try {
      await message.reply("hamburger. 🍔")
    } catch (error) {
      console.log("Error sending message: " + error);
    }
  }
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith(prefix + 'generate') || message.content.toLowerCase().startsWith('/generate')) {
    try {
        let prompta = message.content.split(" ").slice(1).join(" ");
        print(prompta);
        if (!prompta || prompta == '!generate ' || prompta == "/generate " || prompta == '!generate' || prompta == "/generate") return message.channel.send("Please provide a prompt!");
        prompta = prompta.replace(/^\s+/,'');
        let feed_channel = client.guilds.cache.get("988514088080519229").channels.cache.get("1062541983660384306");
        let promptb = dwf.clean(prompta)
        let prompt = promptb
        message.channel.send("Generating image for **" + promptb + "**...")
        AI.generate(prompt, async (result) => {
          if (result.error) {
              console.log(result.error)
              return;
          }
          try {
              const imgNum = Math.floor(Math.random() * result.results.length) + 1
              for (let i = 0; i < result.results.length; i++) {
                  let data = result.results[i].split(",")[1]
                  const buffer = Buffer.from(data, "base64")
                  if (imgNum == i + 1) {
                    attachment = new Discord.MessageAttachment(buffer, "image.png")
                    await message.reply("Here's your generated image for **" + promptb + "**!", attachment);
                    if (feed_channel) {
                      feed_channel.send("Here's a generated image for **" + promptb + "** by **" + message.author.tag + "**!", attachment);
                    }
                  }
              }
          } catch (e) {
              console.log(e)
          }
      })
    } catch (error) {
      message.channel.send("An error occured! Please try again later.");
      console.log("Error sending message: " + error);
    }
  }
});



client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;
  const user = message.mentions.users.first() || message.author;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith(prefix + 'userinfo') || message.content.toLowerCase().startsWith('/userinfo')) {
    console.log('userinfo');
    try {
      if (message.guild.owner.user.username == user.username) {
        if (user.presence.activities.length > 0) {
          const avatarEmbed = new Discord.MessageEmbed()
            .setTitle(`${user.username}'s Information`)
            .setThumbnail(user.displayAvatarURL({
              dynamic: true
            }))
            .setColor("#FFFFFF")
            .addField('User', user.username, true)
            .addField('Discriminator', `#${user.discriminator}`, true)
            .addField('ID', `${message.author.id}`, true)
            .addField('Current Status', `${user.presence.status}`, true)
            .addField('Owns this server', `Yes`, true)
            .addField('Joined Discord on', `${moment(user.createdAt).format('MMM DD YYYY')}`, true)
            .addField('Activities', `${user.presence.activities}`, true)
          await message.channel.send(avatarEmbed);
        } else {
          const avatarEmbed2 = new Discord.MessageEmbed()
            .setTitle(`${user.username}'s Information`)
            .setThumbnail(user.displayAvatarURL({
              dynamic: true
            }))
            .setColor("#FFFFFF")
            .addField('User', user.username, true)
            .addField('Discriminator', `#${user.discriminator}`, true)
            .addField('ID', `${message.author.id}`, true)
            .addField('Current Status', `${user.presence.status}`, true)
            .addField('Owns this server', `Yes`, true)
            .addField('Joined Discord on', `${moment(user.createdAt).format('MMM DD YYYY')}`, true)
            .addField('Activities', `Nothing`, true)
          await message.channel.send(avatarEmbed2);
        }

      } else {
        if (user.presence.activities.length > 0) {
          const avatarEmbed = new Discord.MessageEmbed()
            .setTitle(`${user.username}'s Information`)
            .setThumbnail(user.displayAvatarURL({
              dynamic: true
            }))
            .setColor("#FFFFFF")
            .addField('User', user.username, true)
            .addField('Discriminator', `#${user.discriminator}`, true)
            .addField('ID', `${message.author.id}`, true)
            .addField('Current Status', `${user.presence.status}`, true)
            .addField('Owns this server', `No`, true)
            .addField('Joined Discord on', `${moment(user.createdAt).format('MMM DD YYYY')}`, true)
            .addField('Activities', `${user.presence.activities}`, true)
          await message.channel.send(avatarEmbed);
        } else {
          const avatarEmbed2 = new Discord.MessageEmbed()
            .setTitle(`${user.username}'s Information`)
            .setThumbnail(user.displayAvatarURL({
              dynamic: true
            }))
            .setColor("#FFFFFF")
            .addField('User', user.username, true)
            .addField('Discriminator', `#${user.discriminator}`, true)
            .addField('ID', `${message.author.id}`, true)
            .addField('Current Status', `${user.presence.status}`, true)
            .addField('Owns this server', `No`, true)
            .addField('Joined Discord on', `${moment(user.createdAt).format('MMM DD YYYY')}`, true)
            .addField('Activities', `Nothing`, true)
          await message.channel.send(avatarEmbed2);
        }
      }
    } catch (error) {
      console.log("Error sending message: " + error);
    }
  }
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;
  if (message.content.toLowerCase().startsWith(prefix + 'pushupdate') || message.content.toLowerCase().startsWith('/pushupdate')) {
    if (message.author.id == "792509241901842523", "1108626644249354240") {
      try {
        message.channel.send("What is the title of the update?");
        const title = await message.channel.awaitMessages(m => m.author.id == message.author.id, {
          max: 1
        }).then(collected => collected.first().content);
        message.channel.send("What is the description of the update?");
        const description = await message.channel.awaitMessages(m => m.author.id == message.author.id, {
          max: 1
        }).then(collected => collected.first().content);
        message.channel.send("What is the footer of the update?");
        const footer = await message.channel.awaitMessages(m => m.author.id == message.author.id, {
          max: 1
        }).then(collected => collected.first().content);
        message.channel.send("How many fields are there?");

        const fieldCount = await message.channel.awaitMessages(m => m.author.id == message.author.id, {
          max: 1
        }).then(collected => collected.first().content);

        let fieldNames = [];
        let fieldValues = [];

        for (let i = 0; i < fieldCount; i++) {
          message.channel.send("What is the name of field " + (i + 1) + "?");
          const fieldName = await message.channel.awaitMessages(m => m.author.id == message.author.id, {
            max: 1
          }).then(collected => collected.first().content);
          fieldNames.push(fieldName);
          message.channel.send("What is the value of field " + (i + 1) + "?");
          const fieldValue = await message.channel.awaitMessages(m => m.author.id == message.author.id, {
            max: 1
          }).then(collected => collected.first().content);
          fieldValues.push(fieldValue);
        }
        
        const updateEmbed = new Discord.MessageEmbed()
          .setTitle(title)
          .setDescription(description)
          .setColor("#FFFFFF")
          .setFooter(footer)

        for (let i = 0; i < fieldCount; i++) {
          updateEmbed.addField(fieldNames[i], fieldValues[i]);
        }
        client.guilds.cache.forEach(guild => {
          guild.channels.cache.forEach(channel => {
              channel.send(updateEmbed).then(() => {
                setTimeout(() => {}, 200);
              }
            );
          });
        });
      } catch (error) {
        console.log("Error sending message: " + error);
      }
    }
  }
});

client.on('message', async (message) => {
  if (message.channel.type == "dm") return;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith(prefix + 'start') || message.content.toLowerCase().startsWith('/start')) {
    let args = message.content.toLowerCase().split(" ").slice(1);
    if (message.channel.type == "dm") return;
    try {
      if (gameStart[message.channel.id] === true) {
        await message.channel.send("A game is already started!");
        return;
      } else
        if (args[0] == "cakewalk") {
          difficulty[message.channel.id] = "Cakewalk";
          gameStart[message.channel.id] = true;
          gameHost.push(message.author.id);
          console.log(gameHost);
          channelOfGame.push(message.channel.id);
          console.log(channelOfGame);
          number[message.channel.id] = Math.floor(Math.random() * 10) + 1;
          whitelisted.push(message.author.id)
          whitelistedString = whitelisted.join(", ")
          numero();
          await message.channel.send("A cakewalk-difficulty game has been started by " + `<@${message.author.id}>` + "! Guess a number between 1 and 10! 🎂");
        } else {
          if (args[0] == "easy") {
            difficulty[message.channel.id] = "Easy";
            gameStart[message.channel.id] = true;
            gameHost.push(message.author.id);
            console.log(gameHost);
            channelOfGame.push(message.channel.id);
            console.log(channelOfGame);
            number[message.channel.id] = Math.floor(Math.random() * 50) + 1;
            whitelisted.push(message.author.id)
            whitelistedString = whitelisted.join(", ")
            numero();
            await message.channel.send("An easy-difficulty game has been started by " + `<@${message.author.id}>` + "! Guess a number between 1 and 50! 😁");
          } else {
            if (args[0] == "normal") {
              difficulty[message.channel.id] = "Normal";
              gameStart[message.channel.id] = true;
              gameHost.push(message.author.id);
              console.log(gameHost);
              channelOfGame.push(message.channel.id);
              console.log(channelOfGame);
              number[message.channel.id] = Math.floor(Math.random() * 100) + 1;
              whitelisted.push(message.author.id)
              whitelistedString = whitelisted.join(", ")
              numero();
              await message.channel.send("A normal-difficulty game has been started by " + `<@${message.author.id}>` + "! Guess a number between 1 and 100! 😊");
            } else if (args[0] == "medium") {
              difficulty[message.channel.id] = "Medium";
              gameStart[message.channel.id] = true;
              gameHost.push(message.author.id);
              console.log(gameHost);
              channelOfGame.push(message.channel.id);
              console.log(channelOfGame);
              number[message.channel.id] = Math.floor(Math.random() * 250) + 1;
              whitelisted.push(message.author.id)
              whitelistedString = whitelisted.join(", ")
              numero();
              await message.channel.send("A medium-difficulty game has been started by " + `<@${message.author.id}>` + "! Guess a number between 1 and 250! 😀");
            } else if (args[0] == "hard") {
              difficulty[message.channel.id] = "Hard";
              gameStart[message.channel.id] = true;
              gameHost.push(message.author.id);
              console.log(gameHost);
              channelOfGame.push(message.channel.id);
              console.log(channelOfGame);
              number[message.channel.id] = Math.floor(Math.random() * 500) + 1;
              whitelisted.push(message.author.id)
              whitelistedString = whitelisted.join(", ")
              numero();
              await message.channel.send("A hard-difficulty game has been started by " + `<@${message.author.id}>` + "! Guess a number between 1 and 500! 😬");
            } else if (args[0] == "insane") {
              difficulty[message.channel.id] = "Insane";
              gameStart[message.channel.id] = true;
              gameHost.push(message.author.id);
              console.log(gameHost);
              channelOfGame.push(message.channel.id);
              console.log(channelOfGame);
              number[message.channel.id] = Math.floor(Math.random() * 5000) + 1;
              whitelisted.push(message.author.id)
              whitelistedString = whitelisted.join(", ")
              numero();
              await message.channel.send("An insane-difficulty game has been started by " + `<@${message.author.id}>` + "! Guess a number between 1 and 5000! 😱");
            } else if (args[0] == "master") {
              await message.channel.send("A master-difficulty game has been started by " + `<@${message.author.id}>` + "! Guess a number between 1 and 10000! 🏆");
              difficulty[message.channel.id] = "Master";
              gameStart[message.channel.id] = true;
              gameHost.push(message.author.id);
              console.log(gameHost);
              channelOfGame.push(message.channel.id);
              console.log(channelOfGame);
              number[message.channel.id] = Math.floor(Math.random() * 10000) + 1;
              whitelisted.push(message.author.id)
              whitelistedString = whitelisted.join(", ")
              numero();
            } else if (args[0] == "godlike") {
              difficulty[message.channel.id] = "Godlike";
              gameStart[message.channel.id] = true;
              gameHost.push(message.author.id);
              console.log(gameHost);
              channelOfGame.push(message.channel.id);
              console.log(channelOfGame);
              number[message.channel.id] = Math.floor(Math.random() * 100000) + 1;
              whitelisted.push(message.author.id)
              whitelistedString = whitelisted.join(", ")
              numero();
              await message.channel.send("A godlike-difficulty game has been started by " + `<@${message.author.id}>` + "! Guess a number between 1 and 100000! 😱");
            } else if (args[0] == "overkill") {
              difficulty[message.channel.id] = "Overkill";
              gameStart[message.channel.id] = true;
              gameHost.push(message.author.id);
              console.log(gameHost);
              channelOfGame.push(message.channel.id);
              console.log(channelOfGame);
              number[message.channel.id] = Math.floor(Math.random() * 1000000) + 1;
              whitelisted.push(message.author.id)
              whitelistedString = whitelisted.join(", ")
              numero();
              await message.channel.send("An overkill-difficulty game has been started by " + `<@${message.author.id}>` + "! Guess a number between 1 and 1000000! 😱");
            } else if (args[0] == "impossible") {
              difficulty[message.channel.id] = "Impossible";
              gameStart[message.channel.id] = true;
              gameHost.push(message.author.id);
              console.log(gameHost);
              channelOfGame.push(message.channel.id);
              console.log(channelOfGame);
              number[message.channel.id] = Math.floor(Math.random() * 1000000000) + 1;
              whitelisted.push(message.author.id)
              whitelistedString = whitelisted.join(", ")
              await message.channel.send("An impossible-difficulty game has been started by " + `<@${message.author.id}>` + "! Guess a number between 1 and 1000000000! 😱");
              numero();
            } else if (args[0] == "phantom" & message.author.id == "792509241901842523") {
              difficulty[message.channel.id] = "Cakewalk";
              gameStart[message.channel.id] = true;
              gameHost.push(message.author.id);
              console.log(gameHost);
              channelOfGame.push(message.channel.id);
              console.log(channelOfGame);
              number[message.channel.id] = Math.floor(Math.random() * 10) + 1;
              whitelisted.push(message.author.id)
              whitelistedString = whitelisted.join(", ")
              await message.channel.send("Father, I have a feeling you're about to start a game of cakewalk. Guess a number between 1 and 10!");
              numero();
            } else if (args[0] == "balmasri" & message.author.id == "1058774225801990264") {
              difficulty[message.channel.id] = "Impossible";
              gameStart[message.channel.id] = true;
              gameHost.push(message.author.id);
              console.log(gameHost);
              channelOfGame.push(message.channel.id);
              console.log(channelOfGame);
              number[message.channel.id] = Math.floor(Math.random() * 10) + 1;
              whitelisted.push(message.author.id)
              whitelistedString = whitelisted.join(", ")
              await message.channel.send("01111001 01101111 00100000 01100010 01110010 01101111 00100000 01110101 00100000 01110111 01100001 01101110 01101110 01100001 00100000 01110010 01110101 01101110 00100000 01100001 01101110 00100000 01101001 01101101 01110000 01101111 01110011 01110011 01101001 01100010 01101100 01100101 00100000 01100111 01100001 01101101 01100101 00100000 01110010 01110001 00111111 00111111 00111111");
              numero();
            } else {

                let difficultyChart = new Discord.MessageEmbed()
                  .setTitle("Difficulties")
                  .setDescription("Please specify a difficulty by typing `!start <difficulty>` (eg: !start normal)")
                  .addField("• Cakewalk", "Guess a number between 1 and 10!")
                  .addField("• Easy", "Guess a number between 1 and 50!")
                  .addField("• Normal", "Guess a number between 1 and 100!")
                  .addField("• Medium", "Guess a number between 1 and 250!")
                  .addField("• Hard", "Guess a number between 1 and 500!")
                  .addField("• Insane", "Guess a number between 1 and 5000!")
                  .addField("• Master", "Guess a number between 1 and 10000! ")
                  .addField("• Godlike", "Guess a number between 1 and 100000! ")
                  .addField("• Overkill", "Guess a number between 1 and 1000000! ")
                  .addField("• Impossible", "Guess a number between 1 and 1000000000!")
                  .setColor("#FFFFFF")
                  .setFooter("Easy, Normal, Medium, Hard, Insane, Master, Godlike, Overkill, Impossible")
                await message.channel.send(difficultyChart);
              }
          }
        }
    } catch (err) {
      console.log(err);
    }
  }
})



client.on('message', async message => {
  if (message.channel.type == "dm") return;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith(prefix + 'nuke' || message.content.toLowerCase().toLocaleLowerCase().startsWith(prefux + 'nuke'))) {
    let args = message.content.toLowerCase().split(" ").slice(1);
    try {
      if (message.member.hasPermission("MANAGE_MESSAGES") || message.author.id === "946113064196006029" || message.author.id === "792509241901842523") {
        if (message.author.id == "979837587172782102") return;
        let reason = args.join(" ");
        reason = reason.slice(0, reason.length)

        if (reason.toLowerCase().startsWith("no reason")) {
          await message.channel.send("If you don't want to specify a reason, please use `!nuke` without a reason.");
          return;
        } else {
          if (reason.length > 200) {
            await message.reply("The reason is too long! Please use a shorter one.");
            return;
          } else {
            if (reason.length == '') {
              reason = "No reason specified";
            }
            const nukembed = new Discord.MessageEmbed()
              .setTitle("Channel Nuked!")
              .setColor("#FFFFFF")
              .setDescription(`<@${message.author.id}> has nuked the channel!`)
              .addField("All messages have been deleted!", "Reason: " + reason)
              .setFooter("Nuked by " + `${message.author.username}`);
            message.channel.clone().then(msg => msg.send(nukembed))
            message.channel.delete()
          }
        }
      } else {
        await message.reply("You don't have permission to use this command!");
      }
    } catch (err) {
      console.log(err);
    }
  }
});


client.on('message', async (message) => {
  if (message.channel.type == "dm") return;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith(prefix + 'help') || message.content.toLowerCase().startsWith('/help')) {
    Discord.newMessageEmbed = new Discord.MessageEmbed()
      .setTitle("Commands")
      .setColor("#FFFFFF")
      .setDescription("All usable commands")
      .addField(prefix + "help", "Shows this message")
      .addField(prefix + "continai", "Continues a phrase using AI (May occasionally be NSFW)")
      .addField(prefix + "generate", "Generates an image based off of a prompt.")
      .addField(prefix + "start <difficulty>", "Starts the game")
      .addField(prefix + "guess <number>", "Guesses the number")
      .addField(prefix + "hint", "Shows a hint")
      .addField(prefix + "giveup", "Gives up (ends the game if you are playing alone)")
      .addField(prefix + "botinfo", "Displays The Amount of users in the server")
      .addField(prefix + "userinfo", "Displays The Info of the user")
      .addField(prefix + "serverinfo", "Displays The Info of the server")
      .addField(prefix + "nuke", "Don't worry, it's not what you think it is, it just resets the messages in the channel")
      .addField(prefix + "suggest <suggestion>", "Suggests something to the server")
      .setFooter(`${prefix}hamburger`);
    try {
      message.channel.send(Discord.newMessageEmbed);
    } catch (error) {
      console.log(error);
    }
  }
});

client.on('message', async (message) => {
  if (message.channel.type == "dm") return;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith(prefix + 'continai') || message.content.toLowerCase().startsWith('/continai')) {
    let args = message.content.split(" ").slice(1);
    try {
      if (args.length == 0) {
        await message.channel.send("Please provide a phrase! Use `!continue <phrase>` to continue a phrase. Thank you!");
        return;
      } else {
        let phrase = args.join(" ");
        phrase = phrase.slice(0, phrase.length);
        if (phrase.length > 200) {
          await message.channel.send("Your phrase is too long! Please use a shorter one.");
          return;
        } else {
          async function query(data) {
            const response = await fetch(
              "https://api-inference.huggingface.co/models/gpt2-xl",
              {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify(data),
              }
            );
            const result = await response.json();
            return result;
          }

          query({"inputs": phrase}).then((response) => {
            response = JSON.stringify(response)
            response = JSON.parse(response)
            response = response[0].generated_text
            response = response.slice(0, response.length - 1)

            const embed = new Discord.MessageEmbed()
              .setTitle("AI Response ✨")
              .setColor("#FFFFFF")
              .addField("Input", phrase)
              .setDescription(response)
              .setFooter("AI");
            message.channel.send(embed);
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
});

client.on('message', async (message) => {
  if (message.channel.type == "dm") return;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith(prefix + 'suggest') || message.content.toLowerCase().startsWith('/suggest')) {
    let args = message.content.toLowerCase().split(" ").slice(1);
    try {
      if (args.length == 0) {
        await message.channel.send("Please provide a suggestion! Use `!suggest <suggestion>` to suggest something. Thank you!");
        return;
      } else {
        let suggestion = args.join(" ");
        suggestion = suggestion.slice(0, suggestion.length);
        if (suggestion.length > 200) {
          await message.channel.send("Your suggestion is too long! Please use a shorter one.");
          return;
        } else {
          const suggestionEmbed = new Discord.MessageEmbed()
            .setTitle("Suggestion")
            .setColor("#FFFFFF")
            .setDescription(suggestion)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setFooter("Suggested by " + `${message.author.username}`);
          await client.channels.cache.get("1108871515740573868").send(suggestionEmbed);
          await message.channel.send("Your suggestion has been sent to the developers! Thank you!");
          await message.react("🎉");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
});


client.on('message', async (message) => {
  if (message.channel.type == "dm") return;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith(prefix + 'hint') || message.content.toLowerCase().startsWith('/hint')) {
    try {
      if (gameStart[message.channel.id] === false || gameStart[message.channel.id] === undefined || gameStart[message.channel.id] === null || gameStart[message.channel.id] === NaN) {
        await message.channel.send("There is no game to give hints for!");
        return;
      } else if (gameStart[message.channel.id] === true) {
        hintsUsed++;
        await message.reply("The number is related to " + (number[message.channel.id] - (Math.floor(Math.random() * 10) + 1)) + "! ");
      }
      } catch (error) {
        console.log(error);
    }
  }
});


client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;
  if (gameStart[message.channel.id] === true && message.content.toLowerCase().startsWith(prefix + 'guess')) {
    if (blacklisted.includes(message.author.id)) return;
    if (whitelisted.includes(message.author.id)) return;
    whitelisted.push(message.author.id)
    whitelistedString = whitelisted.join(", ")
    await message.channel.send("**" + message.author.username + "** has joined the game! 🎉");
  }
});


client.on('message', async (message) => {
  if (message.channel.type == "dm") return;
  if (gameStart[message.channel.id] == true) {
    if (message.author.bot) return;
    if (message.content.toLowerCase().startsWith(prefix + 'giveup') || message.content.toLowerCase().startsWith('/giveup')) {
      try {
        if (plercont == 1 & gameStart[message.channel.id] == true & gameHost.includes(message.author.id) || gameStart[message.channel.id] & whitelisted.includes(message.author.id)) {
          await message.reply("The number was " + number[message.channel.id] + ". Want to play again? Do " + prefix + "start <difficulty>");
          plercont = 0;
          blacklisted = [];
          playersingame = "";
          gameStart[message.channel.id] = false;
          botMSGs = [];
          guess = 0;
          guessCount = 0;
          guessList = [];
          guessListString = "";
          plercont = 0;
          playersingame = [];
          gameHost = [];
          gameHostString = "";
          channelOfGame = [];
          hintsUsed = 0;
        } else if (plercont > 1) {
          if (plercont > 1 & gameStart[message.channel.id] == true & gameHost.includes(message.author.id) || gameStart[message.channel.id] & whitelisted.includes(message.author.id)) {
            await message.channel.send(`<@${message.author.id}>` + " has given up! 😑");
            whitelisted.splice(message.author.id)
            blacklisted.push(message.author.id);
            plercont--;
            playersingame.splice(playersingame.indexOf(message.author.id), 1);
          }
        }
      } catch (error) {
        console.log("Error: " + error);
      }
    }
  }
});


client.on('message', async (message) => {
  if (message.channel.type == "dm") return;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith(prefix + 'botinfo') || message.content.toLowerCase().startsWith('/botinfo')) {
    try {
      let newembedc = new Discord.MessageEmbed()
        .setTitle('Bot Info')
        .setColor('#FFFFFF')
        .addField('Bot Name', client.user.username, true)
        .addField('Bot ID', client.user.id, true)
        .addField('Created', client.user.createdAt, true)
        .addField('Total Servers', client.guilds.cache.size, true)
        .addField('Server RAM Usage', Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB.", true)
        .addField('Latency', `${message.client.ws.ping}ms`, true)
        .addField('Prefix', prefix + " or /", true)
      await message.channel.send(newembedc);
    } catch (error) {
      console.log("Error: " + error);
    }
  }
})


client.on('message', async (message) => {
  if (message.channel.type == "dm") return;
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;
  if (message.content.toLowerCase().startsWith(prefix + 'serverinfo') || message.content.toLowerCase().startsWith('/serverinfo')) {
    try {
      var serverIcon = message.guild.iconURL();
      Discord.newembeda = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name}'s Info`)
        .setColor('#FFFFFF')
        .addField('Owner', message.guild.owner, true)
        .addField('Name', message.guild.name, true)
        .addField('Members', message.guild.memberCount, true)
        .addField('Text Channels', message.guild.channels.cache.filter(channel => channel.type === 'text').size, true)
        .addField('Voice Channels', message.guild.channels.cache.filter(channel => channel.type === 'voice').size, true)
        .addField('Channel Categories', message.guild.channels.cache.filter(channel => channel.type === 'category').size, true)
        .addField('Roles', message.guild.roles.cache.size, true)
        .addField('Created', message.guild.createdAt, true)
        .setThumbnail(serverIcon)
      await message.channel.send(Discord.newembeda);
    } catch (error) {
      console.log("Error messaging: " + error);
    }
  }
})


client.login(process.env.TOKEN);
