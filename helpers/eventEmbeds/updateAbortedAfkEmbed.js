const powerCalculation = require('../../commands/commands.js').powerCalculation;

async function updateAbortedAFK(cli, cfg, afkObj){
	const channelName = cli.channels.cache.get(afkObj['channel']).name;

	var rlAmount = 0;
	await cli.channels.cache.get(afkObj['channel']).members.forEach(async function(raiders){
		if (await powerCalculation(cli, cfg, raiders.user.id) > 1) rlAmount++;
	})

	const embed = {
		color: `${afkObj['color']}`,
		timestamp: afkObj['started'],
		footer: {
		text: `The afk check has been aborted by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`
		},
		description: `The afk check is now aborted.`,
		author: {
		name: `${afkObj['eventName']} started by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName} in ${channelName}`,
		icon_url: cli.users.cache.get(afkObj['host']).avatarURL
		}
	};

	return embed;
}

module.exports = updateAbortedAFK;