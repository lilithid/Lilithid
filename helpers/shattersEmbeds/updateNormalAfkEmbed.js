async function updateNormalAfkEmbed(cli, cfg, afkObj){
	const shattersReact = cli.emojis.cache.get('686223695827828774');
	const hostUser = cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']);
	const channelName = cli.channels.cache.get(afkObj['channel']).name;

	const embed = {
		description: `We are starting an afk check now, join \`${channelName}\` and react with ${shattersReact} to not get moved out! If you react with keys or classes and do not bring them, you may be suspended. **Make sure to react with the classes you're bringing!**\n\nStarting in ${((afkObj['timeleft']/60).toString()).charAt(0)} minutes and ${(afkObj['timeleft']%60)} seconds! In addition to reacting with ${shattersReact} also react...`,
		color: '#008502',
		timestamp: afkObj['started'],
		footer: {
		text: `Raiders accounted for: ${afkObj['raiders']}`
		},
		author: {
		name: `Shatters started by ${hostUser.displayName} in ${channelName}`,
		icon_url: cli.users.cache.get(afkObj['host']).avatarURL
		},
/*		fields: [
		{
			name: "If you are bringing a key, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679186891463196673")}`,
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
			name: "If you are bringing a priest, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679187025303437312")}`,
			inline: true
		},
		{
			name: "If your ability is armor break, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679187036325937158")}`,
			inline: true
		},
		{
			name: "If you are bringing a mystic, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679187052813746186")}`,
			inline: true
		},
		{
			name: "If your mystic has an aether orb, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679187061785362472")}`,
			inline: true
		},
		{
			name: "If you are bringing an assassin, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679187076406575107")}`,
			inline: true
		},
		{
			name: "If you are rushing 1st, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679187088146432040")}`,
			inline: true
		},
		{
			name: "If you are rushing 2nd, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679187097621495820")}`,
			inline: true
		},
		{
			name: "If you are rushing secret, react with:",
			value: `${cli.emojis.cache.find(e => e.id == "679187105817296934")}`,
			inline: true
		}
		]*/
	};

	return embed;
}

module.exports = updateNormalAfkEmbed;