async function updateNormalAfkEmbed(cli, cfg, afkObj){
	const voidReact = cli.emojis.cache.get('686217948880568384');
	const hostUser = cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']);
	const channelName = cli.channels.cache.get(afkObj['channel']).name;

	const embed = {
		description: `We are starting an afk check now, join \`${channelName}\` and react with ${voidReact} to not get moved out! If you react with keys or classes and do not bring them, you may be suspended. **Make sure to react with the classes you're bringing!**\n\nStarting in ${((afkObj['timeleft']/60).toString()).charAt(0)} minutes and ${(afkObj['timeleft']%60)} seconds! In addition to reacting with ${voidReact} also react...`,
		color: '#033a91',
		timestamp: afkObj['started'],
		footer: {
		text: `Raiders accounted for: ${afkObj['raiders']}`
		},
		author: {
		name: `Void Entity started by ${hostUser.displayName} in ${channelName}`,
		icon_url: cli.users.cache.get(afkObj['host']).avatarURL
		},
/*		fields: [
		{
			name: "If you are bringing a key, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "686217948507275374")}`,
			inline: true
		},
		{
			name: "If you are bringing a vial, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "686218398597775398")}`,
			inline: true
		},
		{
			name: "If you are bringing a warrior, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679186994190090270")}`,
			inline: true
		},
		{
			name: "If you are bringing a paladin, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679187006403903509")}`,
			inline: true
		},
		{
			name: "If you are bringing a knight, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679187016071512067")}`,
			inline: true
		},
		{
			name: "If your priest has a puri, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "686218398526341129")}`,
			inline: true
		},
		{
			name: "If your paladin has a mseal, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "686218398496981046")}`,
			inline: true
		}
		]*/
	};

	return embed;
}

module.exports = updateNormalAfkEmbed;