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
		case 'verified raider':  case 'event raider': case 'veteran raider': case 'friend': case 'dj': case 'temp key': case 'epic key popper': case 'legendary key popper': case 'godly key popper': case 'master miner': case 'nitro booster': case 'patreon': case 'trial raid leader': case 'staff on leave':
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

function hrtimeToMS (hrtime) {
  return hrtime[0] * 1000 + hrtime[1] / 1000000
}

let restartNeeded = false;

const os = require('os');
const NUMBER_OF_CPUS = os.cpus().length;
let startTime  = process.hrtime()
let startUsage = process.cpuUsage()

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
			case 'restart':
				if (await power > 8){
					let veriCount = require('../main.js').doingVerifications.length;
					let afkCount = require('../helpers/afkUpdater.js').afkArray.length;
					let vetAfkCount = require('../helpers/vetAfkUpdater.js').vetAfkArray.length;
					let eventAfkCount = require('../helpers/eventAfkUpdater.js').eventAfkArray.length;
					
					if (afkCount < 1 && vetAfkCount < 1 && eventAfkCount < 1){
						// restart
						await data.channel.send(`Restarting, please check my uptime in my status.`);
						process.exit();
					} else {
						await data.channel.send(`Cannot restart now, waiting for the ${afkCount} afks, ${vetAfkCount} vet afks and ${eventAfkCount} event afks to end.`)
						restartNeeded = true;
					}
				}
				break;
			case 'getitem':
				if (await power > 1){
					let itemImage = await require('../realmeye.js').getItemImage(data.content.substr(args[0].length+1));
					return data.channel.send(itemImage);
				}
				break;
			case 'commend':
				if (await power > 3){
					return require('./cmds/commend.js')(cli, cfg, data);
				}
			case 'cl': case 'characterlist':
				if (await power > 1){
					const characterList = await require('../realmeye.js').getCharacterList(args[1]);
					return data.channel.send(characterList.join('\n'));
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
			case 'warn':
				if (await power > 2){
					return require('./cmds/warn.js')(cli, cfg, data);
				}
				break;
			case 'warns':
				if (await power > 2){
					return require('./cmds/warns.js')(cli, cfg, data);
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
			case 'changelogs': case 'cls':
				if (await power > 6){
					return require('./cmds/changelogs.js')(cli, cfg, data);
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
			case 'userstats': case 'us': case 'stats':
				if (await power > 0 && data.channel.id != '697220168232992878' && data.channel.id != '697305936733274152' && data.channel.id != '697297355522703360'){ // not general, loot-n-oofs, neither raid-chat
					return require('./cmds/userstats.js')(cli, cfg, data);
				}
				break;
			case 'avatar':
				if (await power > 0 && data.channel.id != '697220168232992878' && data.channel.id != '697305936733274152' && data.channel.id != '697297355522703360'){
					return require('./cmds/avatar.js')(cli, cfg, data);
				}
				break;
			case 'roat':
				if (await power > 0 && data.channel.id != '697220168232992878' && data.channel.id != '697305936733274152' && data.channel.id != '697297355522703360'){
					return require('./cmds/roat.js')(cli, cfg, data);
				}
				break;
			case 'loat':
				if (await power > 0 && data.channel.id != '697220168232992878' && data.channel.id != '697305936733274152' && data.channel.id != '697297355522703360'){
					return require('./cmds/loat.js')(cli, cfg, data);
				}
				break;
			case 'koat':
				if (await power > 0 && data.channel.id != '697220168232992878' && data.channel.id != '697305936733274152' && data.channel.id != '697297355522703360'){
					return require('./cmds/koat.js')(cli, cfg, data);
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
			case 'history': case 'h':
				if (await power > 3){
					return require('./cmds/history.js')(cli, cfg, data);
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
			/*case 'resetweek':
				if (await power > 7){
					const confirmation = await data.channel.send(`Are you **sure** you want to reset this week's parses? This command is not undoable. Please react accordingly.`);
					await confirmation.react(`✅`);
					await confirmation.react(`❌`);

					const confirmationCollector = confirmation.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, limit: 1 });
					confirmationCollector.on('collect', async (reaction, user) => {
						switch (reaction.emoji.name){
							case '✅':
								await cli.channels.cache.find(chan => chan.id == '732256594687164528').send(`@everyone This weeks final parses counts have been totaled below!`).then((msg) => {
									require('./cmds/weeklyactivity.js')(cli, cfg, msg);
								});
								await cli.channels.cache.find(chan => chan.id == '746884655436791928').send(`@everyone This weeks final runs counts have been totaled below!`).then((msg) => {
									require('./cmds/weeklyruns.js')(cli, cfg, msg);
								});
								await confirmation.delete();
								await require('../db.js').resetParses();
								await data.channel.send(`Succesfuly reset this current week's parses.`);
								await require('../db.js').resetActivities();
								await data.channel.send(`Succesfuly reset this current week's activity.`);
								await require('../db.js').resetWeekRuns();
								await data.channel.send(`Succesfuly reset this current week's runs.`);
								break;
							case '❌':
								await confirmation.delete();
								await data.channel.send(`Action was cancelled.`);
								break;
						}
					})
				}
				break;*/
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
			/*case 'log':
				if (await power > 2 && (data.channel.id == cfg.fungalcavern.rlcommands || data.channel.id == cfg.fungalcavern.vetRlCommands || data.channel.id == cfg.fungalcavern.eventRlCommands)){
					return require('./rlCmds/logRuns.js')(cli, cfg, data);
				}
				break;
			case 'pop':
				if (await power > 2 && (data.channel.id == cfg.fungalcavern.rlcommands || data.channel.id == cfg.fungalcavern.vetRlCommands || data.channel.id == cfg.fungalcavern.eventRlCommands)){
					return require('./rlCmds/popKey.js')(cli, cfg, data);
				}
				break;*/
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
			case 'parsemembers': case 'pm':
				if (await power > 2 && (data.channel.id == cfg.fungalcavern.rlcommands || data.channel.id == cfg.fungalcavern.vetRlCommands)){
					return require('./rlCmds/parsemembers.js')(cli, cfg, data);
				}
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
module.exports.restartNeeded = restartNeeded;