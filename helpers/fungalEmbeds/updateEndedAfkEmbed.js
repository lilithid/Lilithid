const powerCalculation = require('../../commands/commands.js').powerCalculation;

async function updateEndedAFK(cli, cfg, afkObj){
	const channelName = cli.channels.cache.get(afkObj['channel']).name;

	var rlAmount = 0;
	await cli.channels.cache.get(afkObj['channel']).members.forEach(async function(raiders){
		if (await powerCalculation(cli, cfg, raiders.user.id) > 1) rlAmount++;
	})
	
	const embed = {
		color: '#074bb8',
		timestamp: afkObj['started'],
		footer: {
		text: `The afk check has been ended by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`
		},
		description: `The AFK Check is now finished.\nWe are currently running with ${rlAmount} Raid leaders and ${afkObj['raiders']} Raiders.`,
		author: {
		name: `Fungal Cavern started by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName} in ${channelName}`,
		icon_url: cli.users.cache.get(afkObj['host']).avatarURL
		}
	};

	return embed;
}

module.exports = updateEndedAFK;