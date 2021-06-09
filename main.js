const Discord = require('discord.js');
const cli = new Discord.Client({ fetchAllMembers: true, sync: true });
const cfg = require('./config.js');
const { isModmailBlacklisted, updateSuspMuteTimers, findbyID, insert_user, pushAction, fixDuplicateNames, getUsersDb, remove_user} = require('./db.js');

const openModmails = [];
const latestVC = [];

const modmailPost = {
	"title": `Mod Mail for Fungal and Crystal Cavern!`,
	"description": `\nIf you want to give feedback or ask a question to the Moderation team, go ahead and message me, the bot!\nRaid Leaders aren't able to see this feedback.\n\nPlease be advised all rules from our <#635419028760035329> apply when sending me messages!\n\nSpamming or using for unintended use may get you banned from the server or blacklisted from sending further mod mail.`,
	"color": 2900657
}

cli.on('ready', async () => {
	console.log('Lilith is running on Fungals!');

	// EMBEDS
	//cli.channels.cache.get('635531240434565160').send({ embed: modmailPost });

    // afkUpdater 5s interval
    setInterval(function() {
        require('./helpers/afkUpdater.js')(cli, cfg);
        require('./helpers/vetAfkUpdater.js')(cli, cfg);
        require('./helpers/eventAfkUpdater.js')(cli, cfg);
    }, 5000);

    setInterval(function() {
        require('./helpers/modmailreactions.js')(cli, cfg);
		updateSuspMuteTimers(cli, cfg);
    }, 60000);

    // on startup, add raiders with the role but not in db
    setInterval(async function() {
    	await fixDuplicateNames(cli, cfg);
    	await getUsersDb(async function(dbResultt){
    		// fix users that left
    		dbResultt.forEach(async userInDb => {
    			if (userInDb.id != undefined) {
	    			if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.find(mmbr => mmbr.id == userInDb.id) == undefined && !userInDb.modmailblacklisted){
	    				await remove_user(userInDb.id);
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

	// regular
	if (data.author.bot) return;

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

		// modmail, check server
		isModmailBlacklisted(data.author.id, async function(result){
			if (result == true) return data.channel.send(`You are blacklisted from modmailing to Fungal Cavern, your message was ignored.`);
			return require('./helpers/modmail.js')(cli, cfg, data);
		})
	}

	
	// commands (wip: separate user and rl commands before handling them)
	if (data.channel.type != 'dm' && data.guild.id == cfg.fungalcavern.id){
		return require('./commands/commands.js')(cli, cfg, data);
	}
})

const raidingVCIDS = ['635542462525472809', '635542647788011521', '635547598668955709', '698467094118924388', '698467148476973097', '698516581709250590', // regular
'656916239037497355', '760002727521681418', '790299867473641543', '790299902286102618', // vet
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
module.exports.latestVC = latestVC;