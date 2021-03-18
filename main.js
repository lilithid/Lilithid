const Discord = require('discord.js');
const cli = new Discord.Client({ fetchAllMembers: true, sync: true });
const cfg = require('./config.js');
const { isModmailBlacklisted, updateSuspMuteTimers, findbyID, insert_user, pushAction, addParse, fixDuplicateNames, addActivity, getUsersDb, isExpelled, remove_user, popKey } = require('./db.js');

const openModmails = [];
const doingVerifications = [];
const veriMsgArray = [];
const latestVC = [];

const talkedRecentlyInModlogs = new Set();
const parsedRecently = new Set();

const veriEmbed = {
	"title": `Verification`,
	"description": `\nSteps to Verify:\n1. Make sure the bot can DM you.\n2. Set everything in realmeye public except your last known location.\n3. Simply react with the ✅ below.\n4. Follow the instructions the bot sends.\n\nIf you have any problems with verification, direct message me, the bot.`,
	"color": 2900657
};

const vetVeriEmbed = {
	"title": `Veteran Verification`,
	"description": `\nReact with ✅ to apply for the role and react with ❌ to remove it.\n\nWith the role, you get access to our veteran raiding section.\nMake sure you have your graveyard and character list public before applying.\n\n**__Requirements:__**\n-50x Completed runs\n-2x 8/8 Characters\n-1x 8/8 Melee Character`,
	"color": 2900657
};


const dmVeriEmbed = {
	"title": `Your verification status!`,
	"description": `\nTo start verification on Fungal Cavern\nYou must send me **within this format:** \`verify YourUserName\`.`,
	"color": 2900657
}

const modmailPost = {
	"title": `Mod Mail for Fungal and Crystal Cavern!`,
	"description": `\nIf you want to give feedback or ask a question to the Moderation team, go ahead and message me, the bot!\nRaid Leaders aren't able to see this feedback.\n\nPlease be advised all rules from our <#635419028760035329> apply when sending me messages!\n\nSpamming or using for unintended use may get you banned from the server or blacklisted from sending further mod mail.`,
	"color": 2900657
}

const eventVeriPost = {
	"color": 2900657,
	"description": `React with ✅ to give yourself the role and ❌ to remove it.`,
	"title": `Event verification for Fungal and Crystal Cavern!`
}

let timerSeconds = 0;
let timerMinutes = 0;
let timerHours = 0;
let timerDays = 0;

cli.on('ready', async () => {
	console.log('Cheems is on Fungals!');

	// EMBEDS
	//cli.channels.cache.get('731327250032623696').send({ embed: veriEmbed }).then((msg) => {msg.react('✅'); });
	//cli.channels.cache.get('660888433694212096').send({ embed: eventVeriPost }).then((msg) => { msg.react('✅'); msg.react('❌'); });
	//cli.channels.cache.get('656915788980158484').send({ embed: vetVeriEmbed }).then((msg) => { msg.react('✅'); msg.react('❌'); });
	//cli.channels.cache.get('635531240434565160').send({ embed: modmailPost });

	const veriMsg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.verichannel).messages.fetch('731327827579895842'); // veri msg

	const veriCollector = veriMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0 });
	veriCollector.on('collect', async (reaction, user) => {
		if (reaction.emoji.name == '✅' && !doingVerifications.includes(user.id)){
			const dmVeriMsg = await user.send({ embed: dmVeriEmbed }).catch(async () => {
				const errorMsgDM = await veriMsg.channel.send(`${user}, I couldn't start verification because your dms are set to private.`);
				setTimeout(() => {
					errorMsgDM.delete();
				}, 300000)
			});
			doingVerifications.push(user.id);
			veriMsgArray[user.id] = dmVeriMsg;
		}
	})

	const eventVeriMsg = await cli.channels.cache.find(chan => chan.id == '660888433694212096').messages.fetch('746732373483192400'); // event veri msg

	const eventVeriCollector = eventVeriMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0 });
	eventVeriCollector.on('collect', async (reaction, user) => {
		if (reaction.emoji.name == '✅'){
			await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.add(cfg.fungalcavern.eventRaiderRole).catch(console.error);
		} else if (reaction.emoji.name == '❌'){
			await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.remove(cfg.fungalcavern.eventRaiderRole).catch(console.error);
		}
	})

	const vetVeriMsg = await cli.channels.cache.find(chan => chan.id == '656915788980158484').messages.fetch('746788440691048639'); // vet veri msg
	
	const vetVeriCollector = vetVeriMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0 });
	vetVeriCollector.on('collect', async (reaction, user) => {
		if (reaction.emoji.name == '✅'){
			return require('./helpers/vetverification.js')(cli, cfg, user);
		} else if (reaction.emoji.name == '❌'){
			await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.remove(cfg.fungalcavern.vetRaiderRole).catch(console.error);
			return;
		}
	})

    // afkUpdater 5s interval
    setInterval(function() {
        require('./helpers/afkUpdater.js')(cli, cfg);
        require('./helpers/vetAfkUpdater.js')(cli, cfg);
        require('./helpers/eventAfkUpdater.js')(cli, cfg);

        let timer = `${timerDays}d, ${timerHours}h, ${timerMinutes}m, ${timerSeconds}s`;
		cli.user.setActivity(`${timer}`, { type: ``});
		timerSeconds += 5;
		
		if (timerHours > 22 && timerMinutes > 58 && timerSeconds > 55) { timerDays += 1; timerHours = 0; timerMinutes = 0; timerSeconds = 0; }
		if (timerMinutes > 58 && timerSeconds > 55) { timerHours += 1; timerMinutes = 0; timerSeconds = 0; }
		if (timerSeconds > 55) { timerMinutes += 1; timerSeconds = 0; }
    }, 5000);

    setInterval(function() {
        require('./helpers/modmailreactions.js')(cli, cfg);
        require('./helpers/veripending.js')(cli, cfg);
        require('./helpers/vetveripending.js')(cli, cfg);
		updateSuspMuteTimers(cli, cfg);
    }, 60000);

    // current week parses
    setInterval(async function() {
    	await cli.channels.cache.find(chan => chan.id == '732256566069428376').bulkDelete(5).catch(err => console.error(err));
    	await cli.channels.cache.find(chan => chan.id == '732256566069428376').send(`Updating..`).then((msg) => {
    		require('./commands/cmds/weeklyactivity.js')(cli, cfg, msg);
    		msg.delete();
    	});
    	await cli.channels.cache.find(chan => chan.id == '746390981993300049').bulkDelete(5).catch(err => console.error(err));
    	await cli.channels.cache.find(chan => chan.id == '746390981993300049').send(`Updating..`).then((msg) => {
    		require('./commands/cmds/weeklyruns.js')(cli, cfg, msg);
    		msg.delete();
    	});
    }, 180000);

    // on startup, add raiders with the role but not in db
    setInterval(async function() {
    	await fixDuplicateNames(cli, cfg);
    	await getUsersDb(async function(dbResultt){
    		// fix users that left
    		dbResultt.forEach(async userInDb => {
    			if (userInDb.id != undefined) {
	    			if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.find(mmbr => mmbr.id == userInDb.id) == undefined && !userInDb.modmailblacklisted){
	    				await isExpelled(userInDb.ign, async result => {
	    					if (!result){
	    						await remove_user(userInDb.id);
	    					}
	    				})
	    			}
	    		}
    		})

			cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.id == '635413958144163850').members.forEach(async member => { // Verified Raider
				if (member.user.nickname == member.displayName) return;
				var UserIGN = member.displayName.replace(/[^a-z0-9\|\s]/gi, '');
				let result = dbResultt.find(usr => usr.id == member.user.id);
					if (result == undefined){
						await insert_user(member.user.id, UserIGN);
					} else {
						if (result.ign != UserIGN && UserIGN != undefined){
							await insert_user(member.user.id, UserIGN);
						}
					}
				});
		});
		// nonames
		await require('./commands/cmds/nonames.js')(cli, cfg, undefined, false);
		console.log(`DB Updated!`);
	}, 300000);
	//

})


// Main handle
cli.on('message', async (data) => {

	// Parses logging
	if ((data.content.split(' ')[0].toLowerCase() == `-checkvc` || data.content.split(' ')[0].toLowerCase() == `*pm` || data.content.split(' ')[0].toLowerCase() == `*parsemembers` || data.content.split(' ')[0].toLowerCase() == `-parsemembers` || data.content.split(' ')[0].toLowerCase() == `-pm`) && !parsedRecently.has(data.author.id)){
		await addParse(data.author.id);
		await addActivity(data.author.id, 6);
		await parsedRecently.add(data.author.id);
		setTimeout(() => {
			parsedRecently.delete(data.author.id);
        }, 10000);
	}

	// Mod log message
	if (data.channel.id == '635532200842100818' && !talkedRecentlyInModlogs.has(data.author.id) && !data.author.bot){
		await addActivity(data.author.id, 1);
		await talkedRecentlyInModlogs.add(data.author.id);
		setTimeout(() => {
			talkedRecentlyInModlogs.delete(data.author.id);
        }, 30000);
	}

	// regular
	if (data.author.bot && (data.channel.id != '732256566069428376' || data.channel.id != '732256594687164528')) return;

	// modmails
	if (data.channel.type === 'dm') {
		// join command
		if (data.content.toLowerCase().includes('join')){
			if (latestVC[data.author.id] != undefined){
				if (!cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel) return data.channel.send(`You aren't in any voice channel from fungals cavern server\nPlease join one before using the join command!`);
				if (cli.channels.cache.get(latestVC[data.author.id]).members.size >= cli.channels.cache.get(latestVC[data.author.id]).userLimit) return data.channel.send(`Sorry but the channel is full!`);
				await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.setChannel(latestVC[data.author.id]).catch(err => console.error(err));
			} else {
				return data.channel.send(`You were in no voice channel recently!`);
			}
			return;
		}

		// verification
		if (data.content.split(' ')[0].toLowerCase().includes('verify') && !doingVerifications.includes(data.author.id)) return data.channel.send(`Please re-react with ✅ in <#731327250032623696>, you probably tried to verify during a bot restart.`);
		if (doingVerifications.includes(data.author.id) && data.content.split(' ')[0].toLowerCase() == 'verify'){
			const veriMsg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.verichannel).messages.fetch('731327827579895842'); // veri msg
			return require('./helpers/verification.js')(cli, cfg, data, veriMsgArray[data.author.id], veriMsg);
		}

		if (doingVerifications.includes(data.author.id) && data.content.length < 15){
			return data.channel.send(`You sent ${data.content}, please send: \`verify ${data.content}\``);
		}

		// stats command
		if (data.content.includes('stats') && data.content.length < 8){
			cli.channels.cache.get('644229096464973830').send({ embed: {"description": `${data.author} issued \`${data.content}\``, "color": '#4ae607', "timestamp": new Date(data.createdTimestamp).toISOString()} }); // spam log it
			return require('./helpers/stats.js')(cli, cfg, data);
		}

		// modmail, check server
		isModmailBlacklisted(data.author.id, async function(result){
			if (result == true) return data.channel.send(`You are blacklisted from modmailing to Fungal Cavern, message was ignored.`);
			return require('./helpers/modmail.js')(cli, cfg, data);
		})
	}

	
	// commands (wip: separate user and rl commands before handling them)
	if (data.channel.type != 'dm' && data.guild.id == cfg.fungalcavern.id){
		// check if bot is alive slurp : rl side
		// rl chans -> raiding commands, everything else: everywhere, then separate with roles needed for a command
		return require('./commands/commands.js')(cli, cfg, data);
	}
})

const raidingVCIDS = ['635542462525472809', '635542647788011521', '635547598668955709', '698467094118924388', '698467148476973097', '698516581709250590', '698517529899040858', '759966632889286674', '759966672487448646', '759966697674506240', // regular
'656916239037497355', '760002727521681418', '760002750112333835', '760002774628302870', // vet
'659857560588910602', '659857614292647956', '659857679254159371', '659857747487227905']; // events

// join command + Drag channel
cli.on('voiceStateUpdate', async (oldState, newState) => {
	if (raidingVCIDS.includes(oldState.channelID)){
		latestVC[newState.id] = oldState.channelID;
		setTimeout(() => {
			latestVC[newState.id] = undefined;
		}, 300000)
	}

	if (newState.channelID == '749246449987878952'){
		if (latestVC[newState.id] != undefined){
			if (cli.channels.cache.get(latestVC[newState.id]).members.size >= cli.channels.cache.get(latestVC[data.author.id]).userLimit) return newState.member.user.send(`Sorry but the channel ${cli.channels.cache.get(latestVC[newState.id]).name} is full!`);
			await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(newState.id).voice.setChannel(latestVC[newState.id]).catch(err => console.error(err));
		}
	}
})

// Login with token
cli.login(cfg.token);

module.exports.openModmails = openModmails;
module.exports.doingVerifications = doingVerifications;
module.exports.latestVC = latestVC;