async function updatePostAfk(cli, cfg, afkObj){
	const voidReact = cli.emojis.cache.get('686217948880568384');
	const hostUser = cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']);
	const channelName = cli.channels.cache.get(afkObj['channel']).name;
	
	const embed = {
		description: `**__Post afk move-in!__**\nIf you got disconnected due to the android bug or just missed the afk check in general, join lounge **then** react with ${voidReact} to get moved in.\n__Time remaining:__ ${afkObj['timeleft']} seconds.`,
		color: '#033a91',
		timestamp: afkObj['started'],
		footer: {
		text: `The afk check has been ended by ${hostUser.displayName}`
		},
		author: {
		name: `Void Entity started by ${hostUser.displayName} in ${channelName}`,
		icon_url: cli.users.cache.get(afkObj['host']).avatarURL
		}
	};

	return embed;
}

module.exports = updatePostAfk;