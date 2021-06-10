const { getUsersDb } = require('../db.js');

async function isCmd(cli, cfg, data){
	if (data.content.charAt(0) == '*'){
		return true;
	} else {
		return false;
	}
}

async function powerCalculation(cli, cfg, userid){
	const highestRole = cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(userid).roles.highest;
	var power;
	
	switch(highestRole.name.toLowerCase()){
		case 'suspended': case 'suspended but verified': case 'muted':
			power = 0;
			break;
		case 'verified raider':  case 'event raider': case 'veteran raider': case 'friend': case 'dj': case 'temp key': case 'epic key popper': case 'legendary key popper': case 'godly key popper': case 'nitro booster': case 'patreon': case 'trial raid leader': case 'staff on leave':
			power = 1;
			break;
		case 'event master': case 'head event master':
			power = 2;
			break;
		case 'almost raid leader':
			power = 3;
			break;
		case 'raid leader':
			power = 4;
			break;
		case 'veteran raid leader':
			power = 5;
			break;
		case 'security': case 'helper':
			power = 6;
			break;
		case 'officer': case 'head raid leader':
			power = 7;
			break;
		case 'moderator':
			power = 8;
			break;
		case 'developer': case 'admin': case 'pepemander': case '死神':
			power = 9;	
	}

	return power;
}

const os = require('os');
const NUMBER_OF_CPUS = os.cpus().length;
let startTime  = process.hrtime()
let startUsage = process.cpuUsage()

function hrtimeToMS (hrtime) {
  return hrtime[0] * 1000 + hrtime[1] / 1000000
}

async function commands(cli, cfg, data){
	// verify roles
	const power = powerCalculation(cli, cfg, data.author.id);
	if (await isCmd(cli, cfg, data)){
		const args = data.content.substr(1).split(' ');
		switch (args[0].toLowerCase()){
			case 'help': case 'commands': case 'cmds':
				if (await power > 0 && data.channel.id != '635413437647683600' && data.channel.id != '635417481183494164' && data.channel.id != '635537374029283329' && data.channel.id != '635417903034007586' && data.channel.id != '635532511740690474' && data.channel.id != '662287467394629672'){ // not general, loot-n-oofs, neither raid-chat
					return require('./help.js')(cli, cfg, data);
				}
				break;
			case 'dbamount':
				if (await power > 8){
					await getUsersDb(async (users) => {
						await data.channel.send(`I have ${users.length} users logged into the users table.`);
					})
				}
				break;
			case 'getitem':
				if (await power > 1){
					let itemImage = await require('../realmeye.js').getItemImage(data.content.substr(args[0].length+1));
					return data.channel.send(itemImage);
				}
				break;
			case 'cl': case 'characterlist':
				if (await power > 1){
					const characterList = await require('../realmeye.js').getCharacterList(args[1]);
					return data.channel.send(characterList.join('\n'));
				}
				break;
			case 'restart':
				if (await power > 8){
					let afkCount = require('../helpers/afkUpdater.js').afkArray.length;
					let vetAfkCount = require('../helpers/vetAfkUpdater.js').vetAfkArray.length;
					let eventAfkCount = require('../helpers/eventAfkUpdater.js').eventAfkArray.length;
					
					if (afkCount < 1 && vetAfkCount < 1 && eventAfkCount < 1){
						// restart
						await data.channel.send(`Restarting.`);
						process.exit();
					} else {
						await data.channel.send(`Cannot restart now, waiting for the ${afkCount} afks, ${vetAfkCount} vet afks and ${eventAfkCount} event afks to end.`)
					}
				}
				break;
			case 'ping':
				if (await power > 1){
					const pingMsg = await data.channel.send('Checking...');
					var startTimeDB = new Date();
					await require('../db.js').dbPing(async function(result){
						if (result.ign == 'Herdidi'){
							var endTime = new Date();
							// cpu usage
							var now = Date.now()
							while (Date.now() - now < 500);

							const newTime = process.hrtime();
							const newUsage = process.cpuUsage();
							const elapTime = process.hrtime(startTime)
							const elapUsage = process.cpuUsage(startUsage)
							startUsage = newUsage;
							startTime = newTime;


							const elapTimeMS = hrtimeToMS(elapTime)

							const elapUserMS = elapUsage.user / 1000; // microseconds to milliseconds
							const elapSystMS = elapUsage.system / 1000;
							const cpuPercent = (100 * (elapUserMS + elapSystMS) / elapTimeMS / NUMBER_OF_CPUS).toFixed(1) + '%'
							//
							const used = process.memoryUsage().heapUsed / 1024 / 1024;
							pingMsg.edit('', { embed: {
    							"title": `Bot status`,
    							"color": 2900657,
    							"fields": [
    								{
    									"name": `API Latency`,
    									"value": `${pingMsg.createdTimestamp - data.createdTimestamp}ms`
    								},
    								{
    									"name": `Database Latency`,
    									"value": `${(endTime-startTimeDB)}ms`
    								},
    								{
    									"name": `CPU Usage`,
    									"value": `${cpuPercent}`
    								},
    								{
    									"name": `Memory Usage`,
    									"value": `${Math.round(used * 100) / 100} MB`
    								}
    							]
    						}});
						}
					})
				}
				break;
			case 'manualverify': case 'mv':
				if (await power > 5){
					return require('./cmds/manualverify.js')(cli, cfg, data);
				}
				break;
			case 'vetmanualverify': case 'vmv':
				if (await power > 5){
					return require('./cmds/vetmanualverify.js')(cli, cfg, data);
				}
				break;
			case 'vetunverify': case 'vumv':
				if (await power > 5){
					return require('./cmds/vetunverify.js')(cli, cfg, data);
				}
				break;
			case 'unverify': case 'umv':
				if (await power > 5){
					return require('./cmds/unverify.js')(cli, cfg, data);
				}
				break;
			case 'fixname': case 'fn':
				if (await power > 5){
					return require('./cmds/fixname.js')(cli, cfg, data);
				}
			case 'find':
				if (await power > 1){
					return require('./cmds/find.js')(cli, cfg, data);
				}
				break;
			case 'purge':
				if (await power > 6){
					return require('./cmds/purge.js')(cli, cfg, data);
				}
				break;
			case 'mute':
				if (await power > 5){
					return require('./cmds/mute.js')(cli, cfg, data);
				}
				break;
			case 'pmute':
				if (await power > 5){
					return require('./cmds/pmute.js')(cli, cfg, data);
				}
				break;
			case 'unmute':
				if (await power > 5){
					return require('./cmds/unmute.js')(cli, cfg, data);
				}
				break;
			case 'suspend':
				if (await power > 3){
					return require('./cmds/suspend.js')(cli, cfg, data);
				}
				break;
			case 'psuspend':
				if (await power > 4){
					return require('./cmds/psuspend.js')(cli, cfg, data);
				}
				break;
			case 'unsuspend':
				if (await power > 3){
					return require('./cmds/unsuspend.js')(cli, cfg, data);
				}
				break;
			case 'addalt':
				if (await power > 5){
					return require('./cmds/addalt.js')(cli, cfg, data);
				}
				break;
			case 'feedbackblacklist': case 'fbbl':
				if (await power > 5){
					return require('./cmds/feedbackblacklist.js')(cli, cfg, data);
				}
				break;
			case 'avatar':
				if (await power > 0 && data.channel.id != '697220168232992878' && data.channel.id != '697305936733274152' && data.channel.id != '697297355522703360'){
					return require('./cmds/avatar.js')(cli, cfg, data);
				}
				break;
			case 'nonames':
				if (await power > 5){
					return require('./cmds/nonames.js')(cli, cfg, data, true);
				}
				break;
			case 'kick':
				if (await power > 5){
					return require('./cmds/kick.js')(cli, cfg, data);
				}
				break;
			case 'ban':
				if (await power > 6){
					return require('./cmds/ban.js')(cli, cfg, data);
				}
				break;
			case 'poll':
				if (await power > 1){
					return require('./cmds/poll.js')(cli, cfg, data);
				}
				break;
			case 'expelled':
				if (await power > 5){
					return require('./cmds/expelled.js')(cli, cfg, data);
				}
				break;
	// raiding commands
			case 'headcount': case 'hc':
				if (await power > 4 && data.channel.id == cfg.fungalcavern.vetRlCommands){
					return require('./vetrlCmds/vetHeadcount.js')(cli, cfg, data);
				}
				if (await power > 2 && data.channel.id == cfg.fungalcavern.rlcommands){
					return require('./rlCmds/headcount.js')(cli, cfg, data);
				}
				if (await power > 1 && data.channel.id == cfg.fungalcavern.eventRlCommands){
					return require('./eventCmds/eventHeadcount.js')(cli, cfg, data);
				}
				break;
			case 'clear': case 'clean':
				if (await power > 4 && data.channel.id == cfg.fungalcavern.vetRlCommands){
					return require('./vetrlCmds/vetClear.js')(cli, cfg, data);
				}
				if (await power > 2 && data.channel.id == cfg.fungalcavern.rlcommands){
					return require('./rlCmds/clear.js')(cli, cfg, data);
				}
				if (await power > 1 && data.channel.id == cfg.fungalcavern.eventRlCommands){
					return require('./eventCmds/eventClear.js')(cli, cfg, data);
				}
				break;
			case 'yoink':
				if (await power > 2 && (data.channel.id == cfg.fungalcavern.rlcommands || data.channel.id == cfg.fungalcavern.vetRlCommands || data.channel.id == cfg.fungalcavern.eventRlCommands)){
					return require('./rlCmds/yoink.js')(cli, cfg, data);
				}
				break;
			case 'lock':
				if (await power > 4 && data.channel.id == cfg.fungalcavern.vetRlCommands){
					return require('./vetrlCmds/vetLock.js')(cli, cfg, data);
				}
				if (await power > 2 && data.channel.id == cfg.fungalcavern.rlcommands){
					return require('./rlCmds/lock.js')(cli, cfg, data);
				}
				if (await power > 1 && data.channel.id == cfg.fungalcavern.eventRlCommands){
					return require('./eventCmds/eventLock.js')(cli, cfg, data);
				}
				break;
			case 'unlock':
				if (await power > 4 && data.channel.id == cfg.fungalcavern.vetRlCommands){
					return require('./vetrlCmds/vetUnlock.js')(cli, cfg, data);
				}
				if (await power > 2 && data.channel.id == cfg.fungalcavern.rlcommands){
					return require('./rlCmds/unlock.js')(cli, cfg, data);
				}
				if (await power > 1 && data.channel.id == cfg.fungalcavern.eventRlCommands){
					return require('./eventCmds/eventUnlock.js')(cli, cfg, data);
				}
				break;
			case 'location': case 'loc':
				if (await power > 4 && data.channel.id == cfg.fungalcavern.vetRlCommands){
					return require('./vetrlCmds/vetLocation.js')(cli, cfg, data);
				}
				if (await power > 2 && data.channel.id == cfg.fungalcavern.rlcommands){
					return require('./rlCmds/location.js')(cli, cfg, data);
				}
				if (await power > 1 && data.channel.id == cfg.fungalcavern.eventRlCommands){
					return require('./eventCmds/eventLocation.js')(cli, cfg, data);
				}
				break;
			case 'afk':
				if (await power > 4 && data.channel.id == cfg.fungalcavern.vetRlCommands){
					return require('./vetrlCmds/vetAfkcheck.js')(cli, cfg, data);
				}
				if (await power > 2 && data.channel.id == cfg.fungalcavern.rlcommands){
					return require('./rlCmds/afkcheck.js')(cli, cfg, data);
				}
				if (await power > 1 && data.channel.id == cfg.fungalcavern.eventRlCommands){
					return require('./eventCmds/eventAfkcheck.js')(cli, cfg, data);
				}
				break;
		}
	}
}

module.exports = commands;
module.exports.powerCalculation = powerCalculation;