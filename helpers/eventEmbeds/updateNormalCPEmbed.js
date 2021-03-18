async function updateNormalControlPanelEmbed(cli, cfg, afkObj){
	if (afkObj['nitro'] == undefined || afkObj['nitro'].length < 1){ var ntrMsg = 'None'; } else {
	var ntrMsg = (('<@!' + afkObj['nitro'].join(', ').replace(/,/gi, '>, <@!').split(' ').join('') + '>').split(',').join(', ')); }

	if (afkObj['key'] == undefined){ var keyMsg = 'None'; } else { var keyMsg = afkObj['key'] };

	const channelName = cli.channels.cache.get(afkObj['channel']).name;

	const embed = {
		color: `${afkObj['color']}`,
		footer: {
		text: "To abort the afk check, react with stop below."
		},
		author: {
		name: `AFK Check control panel for ${channelName}`
		},
		fields: [
		{
			name: "Our current keys are...",
			value: `${cli.emojis.cache.find(e => e.id === afkObj['eventPortalID'])} ${keyMsg}`
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

module.exports = updateNormalControlPanelEmbed;