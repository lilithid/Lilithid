async function updateEndedCP(cli, cfg, afkObj){
	if (afkObj['nitro'] == undefined || afkObj['nitro'].length < 1){ var ntrMsg = 'None'; } else {
	var ntrMsg = (('<@!' + afkObj['nitro'].join(', ').replace(/,/gi, '>, <@!').split(' ').join('') + '>').split(',').join(', ')); }

	if (afkObj['key'] == undefined){ var keyMsg = 'None'; } else { var keyMsg = afkObj['key'] };
	if (afkObj['rusher'] == undefined || afkObj['rusher'].length < 1){ var rusherMsg = 'None'; } else {
	var rusherMsg = (('<@!' + afkObj['rusher'].join(', ').replace(/,/gi, '>, <@!').split(' ').join('') + '>').split(',').join(', ')); }
	
	const channelName = cli.channels.cache.get(afkObj['channel']).name;

	const embed = {
		color: '#990000',
		footer: {
		text: `The afk check has been ended by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`
		},
		author: {
		name: `AFK Check control panel for ${channelName}`
		},
		fields: [
		{
			name: "Our current keys are...",
			value: `${cli.emojis.cache.find(e => e.id === "686217948507275374")} ${keyMsg}`
		},
		{
			name: "Our current rushers are...",
			value: `${cli.emojis.cache.find(e => e.id === "686222430259380427")} ${rusherMsg}`
		},
		{
			name: "Location of the run:",
			value: `> ${afkObj['location']}`
		},
		{
			name: "Nitro boosters with location:",
			value: `${cli.emojis.cache.find(e => e.id === "686223984907255808")} ${ntrMsg}`
		}
		]
	};

	return embed;
}

module.exports = updateEndedCP;