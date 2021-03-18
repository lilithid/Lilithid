
async function fungalHC(cli, cfg, data){
	const afkChannel = cli.channels.cache.get(cfg.fungalcavern.afkchecks);
	const embed = { "title": "**Headcount for Fungal Cavern started by "+data.guild.members.cache.get(data.author.id).displayName+"!**", "color": '#074bb8', "timestamp": new Date(data.createdTimestamp).toISOString(), "description": `React with ${cli.emojis.cache.get('686223695827828774')} to participate and ${cli.emojis.cache.get('686223695798075449')} if you have a key and are willing to pop!` };
	const headCountMsg = await afkChannel.send({ embed });

	// ghostping here
	const mentionHere = await afkChannel.send("@here");
	await mentionHere.delete();

	// react
	const headcountReactions = cfg.fungalHcReactions;
	try {
		await headcountReactions.forEach(async reaction => { await headCountMsg.react(cli.emojis.cache.get(reaction)) });
	} catch(err) { console.error(err) };
	await data.channel.send(`Headcount started.`);
}

/////////////////////////////////////////////////////////////////////////////////
async function headcount(cli, cfg, data){
	return fungalHC(cli, cfg, data);
}

module.exports = headcount;