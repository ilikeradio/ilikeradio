const Discord = require("discord.js")
const fetch = require('node-fetch')


const client = new Discord.Client()
const config = require("./config.json")
const radio = require("./stations.json")

const deleteafter = 20000

const commandcooldown = 1000
const commandRecently = new Set()

client.on("error", (ex) => {
    console.error("ERROR " + ex)
})

client.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
})

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`) 
  client.user.setActivity(`ILIKERADIO 🎵!play🎵`,{type: "LISTENING"})
})

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
})

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`)
})


client.on("message", async message => {
  if(message.author.bot) return
        if(message.content.indexOf(config.prefix) !== 0) return
                if (commandRecently.has(message.author.id)) {
                        message.delete().catch(O_o=>{})
                        message.channel.send("Slow down, not so fast! You'll soon be hearing them sweet tunes! (COOLDOWN: " + commandcooldown/1000 + "s ) - " + message.author)
                        .then(msg => { 
                                msg.delete(deleteafter) 
                        })
                } else {
                        const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
                        const command = args.shift().toLowerCase()

                        if (command === "eval") {
                                if(message.author.id !== config.botOwner) {
                                        // Someone sent a command we recognize but the user is not bot owner. => Do nothing just ignore the command.
                                        return
                                }
                        try {
                                message.delete().catch(O_o=>{})
                                const evalargs = message.content.split(" ").slice(1)
                                const code = evalargs.join(" ")
                                let evaled = eval(code)
                                
                                if (typeof evaled !== "string")
                                    evaled = require("util").inspect(evaled)

                                        message.channel.send(clean(evaled), {code:"xl"})
                                        .then(msg => { 
                                                msg.delete(120000) 
                                        })
                                } catch (err) {
                                        message.reply(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
                                        .then(msg => { 
                                                msg.delete(120000) 
                                        })
                        }
  }

  if(command === "ping") {
	message.delete().catch(O_o=>{})
        const m = await message.channel.send("Ping?")
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`)
        .then(msg => { 
                msg.delete(deleteafter) 
        })
  }
  
if(command == 'help') {
        const playingEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('I LIKE RADIO - HELP')
                .setURL('https://www.ilikeradio.se/')
                .setAuthor(client.user.username,'https://www.ilikeradio.se/wp-content/themes/ilikeradio/assets/images/logo-ilikeradio.png','https://www.ilikeradio.se/')
                .setTimestamp()
                .addField("!help","This command, returns a list of commands!")
                .addField("!invite","Get a invite link to add me to your server!")
                .addField("!stations","Find out more about **I LIKE RADIO**s stations!")
                .addField("!play [station]","Tune in to your favorite station! Just write !play to see stations!")
                .addField("!stop","Had enough?! This makes the bot leave your voice channel.")
                .addField("!np","What is playing on the stations? With this you will know!")
                .addField("!ping","Sound jitter? Check the latency with this!")
                .setFooter(client.user.username, client.user.avatarURL)
        message.delete().catch(O_o=>{})
        message.channel.send(playingEmbed)
        .then(msg => {
                msg.delete(deleteafter)
        })
}

if(command == 'stop') {
		if (!message.member.voiceChannel) return
		        message.member.voiceChannel.leave()
		return
	}

if(command == 'invite') {
        const inviteEmbed = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('Invite me to your server')
        .setURL(config.webURL)
        .setAuthor(client.user.username, config.webURL +'/wp-content/themes/ilikeradio/assets/images/logo-ilikeradio.png',config.webURL)
        .setTimestamp()
        .addField("Invitation link:","https://discordapp.com/oauth2/authorize?client_id="+client.user.id+"&scope=bot&permissions=36826432")                                       
        .setFooter(client.user.username, client.user.avatarURL)
        message.react('😍')
        message.react('👏')
        message.react('🕺')
        message.react('🎶')
        message.channel.send(inviteEmbed)
        .then(msg => {
                message.delete(deleteafter).catch(O_o=>{})
                msg.delete(deleteafter)
        })
}

  if(command === "play") {
	if (!message.member.voiceChannel) { 
		message.delete().catch(O_o=>{})
                message.channel.send('You are not in a voice channel, **join a voice chat and try again!**')
                .then(msg => { 
                        msg.delete(deleteafter) 
                })
	return
	} else {
                const searchStation = args.join(" ").toLowerCase()
                let url
                let radiostation
                let streamurl
                let channel_id
                let found=false
                
                        Object.keys(radio).forEach(function(stn) {
                        if (radio[stn].alias.includes(searchStation)) {
                                url = config.webURL + stn
                                radiostation = radio[stn].name
                                streamurl = radio[stn].streamurl
                                channel_id = radio[stn].channel_id
                                found=true
                        }
                })
        
                if (found) {
                        let now = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0]
                        let past = new Date().toISOString().split('T')[0]+'T00:00:00'

                        message.member.voiceChannel.join()
                        .then(connection => {
                                fetch(config.apiURL+'timeline?channel_id='+channel_id+'&client_id=0&to='+now+'&from='+past+'&limit=1')
                                .then(res => res.json())
                                .then(json => {
                                const playingEmbed = new Discord.RichEmbed()
                                        .setColor('#0099ff')
                                        .setTitle('Now playing')
                                        .setURL('https://www.ilikeradio.se/')
                                        .setAuthor(client.user.username,'https://www.ilikeradio.se/wp-content/themes/ilikeradio/assets/images/logo-ilikeradio.png','https://www.ilikeradio.se/')
                                        .setTimestamp()
                                        .addField(radiostation,url)                                       
                                        .addField("Current song:",json[0].song.artist_name + " - " + json[0].song.title)
                                        .setImage(config.cdnURL + json[0].song.cover_art)
                                        .setFooter(client.user.username, client.user.avatarURL)
                                message.delete().catch(O_o=>{})
                                message.channel.send(playingEmbed)
                                .then(msg => {
                                        msg.delete(deleteafter)
                                })
                        return connection.playStream(streamurl)
                        })
                        .then(dispatcher => {
                                dispatcher.on('error', console.error)
                        })
                })
        } else {
                const pEmbed = new Discord.RichEmbed()
                                .setColor('#0099ff')
                                .setTitle('Play radio')
                                .setURL('https://www.ilikeradio.se/')
                                .setAuthor(client.user.username,'https://www.ilikeradio.se/wp-content/themes/ilikeradio/assets/images/logo-ilikeradio.png','https://www.ilikeradio.se/')
                                .setTimestamp()
                                .setDescription("You need to select channel!")
                                .setFooter(client.user.username, client.user.avatarURL)
                        for(var stn in radio) { 
                                stnName = radio[stn].name
                                cmd = "!play " + radio[stn].alias
                                pEmbed.addField('Listen to ' + stnName,cmd)
                        }
                        message.delete().catch(O_o=>{})
                        message.channel.send(pEmbed)
                        .then(msg => {
                                msg.delete(deleteafter)
                        })
                }
        }
  }

if (command === 'stations') {
	fetch(config.apiURL+'channel')
	.then(res => res.json())
	.then(json => {
	const stationsEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('Station list')
                .setURL('https://www.ilikeradio.se/')
                .setAuthor(client.user.username,'https://www.ilikeradio.se/wp-content/themes/ilikeradio/assets/images/logo-ilikeradio.png','https://www.ilikeradio.se/')
                .setTimestamp()
                .setFooter(client.user.username, client.user.avatarURL)
                var length = json.length
                for (var i = 0;i < length; i++) {
                const obj = json[i]
                stationsEmbed.addField(obj.name,obj.description || 'No description available.')
                }
	message.delete().catch(O_o=>{})
        message.channel.send(stationsEmbed)
        .then(msg => {
                msg.delete(deleteafter)
        })

	})
}

if (command === 'np') {
        fetch(config.apiURL+'channel')
        .then(res => res.json())
        .then(json => {
        const npEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('Now playing')
                .setURL('https://www.ilikeradio.se/')
                .setAuthor(client.user.username,'https://www.ilikeradio.se/wp-content/themes/ilikeradio/assets/images/logo-ilikeradio.png','https://www.ilikeradio.se/')
                .setTimestamp()
                .setFooter(client.user.username, client.user.avatarURL)
                var length = json.length
                for (var i = 0;i < length; i++) {
                        const obj = json[i]
                        if (obj.currentsong == null) { 
                                npEmbed.addField(obj.name,'Nothing playing') 
                        } else {
                                var artist
                        if (obj.currentsong.song.artist_name == null) { 
                                artist = 'no artist name' 
                        } else { 
                                artist = obj.currentsong.song.artist_name 
                        }
                        var title
                        if (obj.currentsong.song.title == null) { 
                                title = 'no song title' 
                        } else { 
                                title = obj.currentsong.song.artist_name 
                        }
                        var song = artist + ' - ' + title
                        var artist = (obj.currentsong.song.artist_name ? obj.currentsong.song.artist_name : 'No artist information.')
                        var title = (obj.currentsong.song.title ? obj.currentsong.song.title : 'No song title available.')
                        npEmbed.addField(obj.name,`${artist} - ${title}`)
                        }
                }
	message.delete().catch(O_o=>{})
        message.channel.send(npEmbed)
        .then(msg => {
	        msg.delete(deleteafter)
	})
  })
}
        commandRecently.add(message.author.id)
        setTimeout(() => {
                commandRecently.delete(message.author.id)
        }, commandcooldown)
    }
})
client.login(config.token)


function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
  else
      return text
}