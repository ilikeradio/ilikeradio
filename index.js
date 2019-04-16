const Discord = require("discord.js");
const fetch = require('node-fetch');


const client = new Discord.Client();
const config = require("./config.json");


const deleteafter = 10000

const commandcooldown = 1000
const commandRecently = new Set();

client.on("error", (ex) => {
    console.error("ERROR " + ex);
});

client.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`ILIKERADIO 🎵!play🎵`,{type: "LISTENING"});
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});


client.on("message", async message => {
  if(message.author.bot) return;
  

  if(message.content.indexOf(config.prefix) !== 0) return;
  
  if (commandRecently.has(message.author.id)) {
            message.delete().catch(O_o=>{});
            message.channel.send("Slow down, not so fast! You'll soon be hearing them sweet tunes! (COOLDOWN: " + commandcooldown/1000 + "s ) - " + message.author).then(msg => { msg.delete(deleteafter) })
    } else {

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


    if (command === "eval") {
    if(message.author.id !== '181477746352979968') {
	message.delete().catch(O_o=>{});
	message.channel.send("Unauthorized. ID: " + message.author.id).then(msg => { msg.delete(deleteafter) }) 
	return;
	}
    try {
	message.delete().catch(O_o=>{});
	const evalargs = message.content.split(" ").slice(1)
	const code = evalargs.join(" ")
	let evaled = eval(code)
	
	if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

                message.channel.send(clean(evaled), {code:"xl"}).then(msg => { msg.delete(120000) })
	} catch (err) {
	        message.reply(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``).then(msg => { msg.delete(120000) })
    }
  }
  

  if(command === "ping") {
        message.delete().catch(O_o=>{});
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`).then(msg => { msg.delete(deleteafter) })
  }
  

if(command == 'help') {
        const playingEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('I LIKE RADIO - HELP')
                .setURL('https://www.ilikeradio.se/')
                .setAuthor(client.user.username,'https://www.ilikeradio.se/wp-content/themes/ilikeradio/assets/images/logo-ilikeradio.png','https://www.ilikeradio.se/')
                .setTimestamp()
                .addField("!help","This command, returns a list of commands!")
                .addField("!play [station]","Tune in to your favorite station! Just write !play to see stations!")
                .addField("!stop","Had enough?! This makes the bot leave your voice channel.")
                .addField("!np","What is playing on the stations? With this you will know!")
                .addField("!ping","Sound jitter? Check the latency with this!")
                .setFooter(client.user.username, client.user.avatarURL);
        message.delete().catch(O_o=>{});
        message.channel.send(playingEmbed)
        .then(msg => {
                msg.delete(deleteafter)
        })
}

if(command == 'stop') {
		if (!message.member.voiceChannel) return;
		        message.member.voiceChannel.leave();
		return;
	}

  if(command === "play") {
	if (!message.member.voiceChannel) { 
		message.delete().catch(O_o=>{});
		message.channel.send('You are not in a voice channel, **join a voice chat and try again!**').then(msg => { msg.delete(deleteafter) })
	return;
	} else {
        const station = args.join(" ").toLowerCase()
        let url
        let radiostation
        let radiourl

        if (station == 'bandit' || station == 'bandit rock') {
                        url = 'http://fm02-ice.stream.khz.se/fm02_mp3'
                        radiostation = 'Bandit Rock'
                        radiourl = 'https://www.ilikeradio.se/banditrock/'
        }
        else if (station == 'rix' || station == 'rix fm') {
                        url = 'http://fm01-ice.stream.khz.se/fm01_mp3'
                        radiostation = 'RIX FM'
                        radiourl = 'https://www.ilikeradio.se/rixfm/'
        }
        else if (station == 'lugna' || station == 'lugna favoriter') {
                        url = 'http://fm03-ice.stream.khz.se/fm03_mp3'
                        radiostation = 'Lugna Favoriter'
                        radiourl = 'https://www.ilikeradio.se/lugnafavoriter/'
        }
        else if (station == 'star' || station == 'star fm') {
                        url = 'http://fm05-ice.stream.khz.se/fm05_mp3'
                        radiostation = 'STAR FM'
                        radiourl = 'https://www.ilikeradio.se/starfm/'
        }
        else if (station == 'power hit' || station == 'power h' || station == 'power hit radio' || station == 'pwr hit' || station == 'pwr h') {
                        url = 'http://fm04-ice.stream.khz.se/fm04_mp3'
                        radiostation = 'Power Hit Radio'
                        radiourl = 'https://www.ilikeradio.se/powerhitradio/'
        }
        else if (station == 'bandit ballads' || station == 'bandit b') {
                        url = 'http://wr21-ice.stream.khz.se/wr21_mp3'
                        radiostation = 'Bandit Ballads'
                        radiourl = 'https://www.ilikeradio.se/banditballads/'
        }
        else if (station == 'bandit classics' || station == 'bandit c') {
                        url = 'http://wr11-ice.stream.khz.se/wr11_mp3'
                        radiostation = 'Bandit Classics'
                        radiourl = 'https://www.ilikeradio.se/banditclassics/'
        }
        else if (station == 'bandit metal' || station == 'bandit m') {
                        url = 'http://wr03-ice.stream.khz.se/wr03_mp3'
                        radiostation = 'Bandit Metal'
                        radiourl = 'https://www.ilikeradio.se/banditmetal/'
        }
        else if (station == 'rix fresh' || station == 'rix fm fresh' || station == 'fresh') {
                        url = 'http://wr04-ice.stream.khz.se/wr04_mp3'
                        radiostation = 'RIX FM Fresh'
                        radiourl = 'https://www.ilikeradio.se/rixfmfresh/'
        }
        else if (station == 'power c' || station == 'power club') {
                        url = 'http://wr06-ice.stream.khz.se/wr06_mp3'
                        radiostation = 'Power Club'
                        radiourl = 'https://www.ilikeradio.se/powerclub/'
        }
        else if (station == 'power s' || station == 'power street') {
                        url = 'http://wr07-ice.stream.khz.se/wr07_mp3'
                        radiostation = 'Power Street'
                        radiourl = 'https://www.ilikeradio.se/powerstreet/'
        }
        else if (station == 'indie' || station == 'indie 101' || station == '101' || station == 'indie101') {
                        url = 'http://wr05-ice.stream.khz.se/wr05_mp3'
                        radiostation = 'Indie 101'
                        radiourl = 'https://www.ilikeradio.se/indie101/'
        }
        else if (station == 'svenska' || station == 'svenska favoriter') {
                        url = 'http://wr13-ice.stream.khz.se/wr13_mp3'
                        radiostation = 'Svenska Favoriter'
                        radiourl = 'https://www.ilikeradio.se/svenskafavoriter/'
        }
        else if (station == 'dansband' || station == 'dansbandsfavoriter' || station == 'dansbands favoriter') {
                        url = 'http://wr15-ice.stream.khz.se/wr15_mp3'
                        radiostation = 'Dansbandsfavoriter'
                        radiourl = 'https://www.ilikeradio.se/dansbandsfavoriter/'
        }
        else if (station == 'country classics' || station == 'country') {
                        url = 'http://wr14-ice.stream.khz.se/wr14_mp3'
                        radiostation = 'Country Classics'
                        radiourl = 'https://www.ilikeradio.se/countryclassics/'
        }
        else if (station == 'star90s' || station == 'star90' || station == 'star 90' || station == 'star 90s' || station == '90s') {
                        url = 'http://wr12-ice.stream.khz.se/wr12_mp3'
                        radiostation = 'Star 90s'
                        radiourl = 'https://www.ilikeradio.se/star90s/'
        }
        else if (station == 'star80s' || station == 'star80' || station == 'star 80' || station == 'star 80s' || station == '80s') {
                        url = 'http://wr02-ice.stream.khz.se/wr02_mp3'
                        radiostation = 'Star 80s'
                        radiourl = 'https://www.ilikeradio.se/star80s/'
        }
        else if (station == 'star70s' || station == 'star70' || station == 'star 70' || station == 'star 70s' || station == '70s') {
                        url = 'http://wr10-ice.stream.khz.se/wr10_mp3'
                        radiostation = 'Star 70s'
                        radiourl = 'https://www.ilikeradio.se/star70s/'
        }
        else if (station == 'star60s' || station == 'star60' || station == 'star 60' || station == 'star 60s' || station == '60s') {
                        url = 'http://wr09-ice.stream.khz.se/wr09_mp3'
                        radiostation = 'Star 60s'
                        radiourl = 'https://www.ilikeradio.se/star60s/'
        }
        else if (station == 'electro' || station == 'electrolounge' || station == 'electro lounge' || station == 'lounge') {
                        url = 'http://wr16-ice.stream.khz.se/wr16_mp3'
                        radiostation = 'Electro Lounge'
                        radiourl = 'https://www.ilikeradio.se/electrolounge/'
        }
        else if (station == 'soul' || station == 'soul classics' || station == 'soul c') {
                        url = 'http://wr08-ice.stream.khz.se/wr08_mp3'
                        radiostation = 'Soul Classics'
                        radiourl = 'https://www.ilikeradio.se/soulclassics/'
        }
        else if (station == 'onehit' || station == 'one hit' || station == 'wonders' || station == '1hit' || station == 'one hit wonders' || station == 'onehitwonders' || station == 'one') {
                        url = 'http://wr18-ice.stream.khz.se/wr18_mp3'
                        radiostation = 'One Hit Wonders'
                        radiourl = 'https://www.ilikeradio.se/onehitwonders/'
} else {
        const pEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('Play radio')
                .setURL('https://www.ilikeradio.se/')
                .setAuthor(client.user.username,'https://www.ilikeradio.se/wp-content/themes/ilikeradio/assets/images/logo-ilikeradio.png','https://www.ilikeradio.se/')
                .setTimestamp()
                .setDescription("You need to select channel!")
                .addField('Listen to Bandit Rock', '!play bandit or bandit rock')
                .addField('Listen to Rix FM', '!play rix or rix fm')
                .addField('Listen to Lugna Favoriter', '!play lugna or lugna favoriter')
                .addField('Listen to STAR FM', '!play star or star fm')
                .addField('Listen to Power Hit Radio', '!play power hit or power h, power hit radio, pwr hit, pwr h')
                .addField('Listen to Bandit Ballads', '!play bandit ballads or bandit b')
                .addField('Listen to Bandit Classics', '!play bandit classics or bandit c')
                .addField('Listen to Bandit Metal', '!play bandit metal or bandit m')
                .addField('Listen to RIX FM Fresh', '!play rix fresh or rix fm fresh, fresh')
                .addField('Listen to Power Club', '!play power club or power c')
                .addField('Listen to Power Street', '!play power street or power s')
                .addField('Listen to Indie 101', '!play indie 101 or indie101, indie, 101')
                .addField('Listen to Svenska Favoriter', '!play svenska favoriter or svenska')
                .addField('Listen to Dansbandsfavoriter', '!play dansbandsfavoriter or dansbands favoriter, dansband')
                .addField('Listen to Country Classics', '!play country classics or country')
                .addField('Listen to Star 90s', '!play star 90s or star90s, star90, star 90, 90s')
                .addField('Listen to Star 80s', '!play star 80s or star80s, star80, star 80, 80s')
                .addField('Listen to Star 70s', '!play star 70s or star70s, star70, star 70, 70s')
                .addField('Listen to Star 60s', '!play star 60s or star60s, star60, star 60, 60s')
                .addField('Listen to Electro Lounge', '!play electro lounge or electrolounge, electro, lounge')
                .addField('Listen to Soul Classics', '!play soul classics or soul, soul c')
                .addField('Listen to One Hit Wonders', '!play one hit wonders or onehit, one hit, wonders, 1hit, onehitwonders, one')
                .setFooter(client.user.username, client.user.avatarURL);
	message.delete().catch(O_o=>{});
        message.channel.send(pEmbed)
        .then(msg => {
	        msg.delete(deleteafter)
	})
	return;
 }


  message.member.voiceChannel.join()
  .then(connection => {
        const playingEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('Now playing')
                .setURL('https://www.ilikeradio.se/')
                .setAuthor(client.user.username,'https://www.ilikeradio.se/wp-content/themes/ilikeradio/assets/images/logo-ilikeradio.png','https://www.ilikeradio.se/')
                .setTimestamp()
                .addField(radiostation,radiourl)
                .setFooter(client.user.username, client.user.avatarURL);
	message.delete().catch(O_o=>{});
        message.channel.send(playingEmbed)
        .then(msg => {
                msg.delete(deleteafter)
        })
  return connection.playStream(url);
   })
  .then(dispatcher => {
        dispatcher.on('error', console.error);
   })
  }
}
if (command === 'stations') {
	fetch('https://app.khz.se/api/v2/channel')
        	.then(res => res.json())
        	.then(json => {
                const stationsEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle('Station list')
                        .setURL('https://www.ilikeradio.se/')
                        .setAuthor(client.user.username,'https://www.ilikeradio.se/wp-content/themes/ilikeradio/assets/images/logo-ilikeradio.png','https://www.ilikeradio.se/')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.avatarURL);
                        var length = json.length
                        for (var i = 0;i < length; i++) {
                        const obj = json[i]
                        stationsEmbed.addField(obj.name,obj.description || 'No description available.')
                        }
                message.delete().catch(O_o=>{});
                message.channel.send(stationsEmbed)
                .then(msg => {
                        msg.delete(deleteafter)
                })
	});
}

if (command === 'np') {
        fetch('https://app.khz.se/api/v2/channel')
                .then(res => res.json())
                .then(json => {
                const npEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle('Now playing')
                        .setURL('https://www.ilikeradio.se/')
                        .setAuthor(client.user.username,'https://www.ilikeradio.se/wp-content/themes/ilikeradio/assets/images/logo-ilikeradio.png','https://www.ilikeradio.se/')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.avatarURL);
                        var length = json.length
                        for (var i = 0;i < length; i++) {
                        const obj = json[i]
                        if (obj.currentsong == null) { npEmbed.addField(obj.name,'Nothing playing') } else {
                        var artist
                        if (obj.currentsong.song.artist_name == null) { artist = 'no artist name' } else { artist = obj.currentsong.song.artist_name }
                        var title
                        if (obj.currentsong.song.title == null) { title = 'no song title' } else { title = obj.currentsong.song.artist_name }
                        var song = artist + ' - ' + title 
                        var artist = (obj.currentsong.song.artist_name ? obj.currentsong.song.artist_name : 'No artist information.')
                        var title = (obj.currentsong.song.title ? obj.currentsong.song.title : 'No song title available.')
                        npEmbed.addField(obj.name,`${artist} - ${title}`)
                                }
                        }
                message.delete().catch(O_o=>{});
                message.channel.send(npEmbed)
                .then(msg => {
                        msg.delete(deleteafter)
                        })
                });
}
        commandRecently.add(message.author.id);
        setTimeout(() => {
          commandRecently.delete(message.author.id);
        }, commandcooldown);
    }
});
client.login(config.token);


function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}