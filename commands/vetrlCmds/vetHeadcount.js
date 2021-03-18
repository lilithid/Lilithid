async function shattsHC(cli, cfg, data){
	const vetAfkChannel = cli.channels.cache.get(cfg.fungalcavern.vetAfkchecks);
	const embed = { "title": "**Headcount for Shatters started by "+data.guild.members.cache.get(data.author.id).displayName+"!**", "color": '#008502', "timestamp": new Date(data.createdTimestamp).toISOString(), "description": `React with ${cli.emojis.cache.get('686223695827828774')} to participate and ${cli.emojis.cache.get('679186891463196673')} if you have a key and are willing to pop!` };
	const headCountMsg = await vetAfkChannel.send({ embed });

	// ghostping here
	const mentionHere = await vetAfkChannel.send("@here");
	await mentionHere.delete();

	// react
	const headcountReactions = cfg.shattersHcReactions;
	try {
		await headcountReactions.forEach(async reaction => { await headCountMsg.react(cli.emojis.cache.get(reaction)) });
	} catch(err) { console.error(err) };
	await data.channel.send(`Headcount started.`);
}

async function voidHC(cli, cfg, data){
	const vetAfkChannel = cli.channels.cache.get(cfg.fungalcavern.vetAfkchecks);
	const embed = { "title": "**Headcount for Void Entity started by "+data.guild.members.cache.get(data.author.id).displayName+"!**", "color": '#033a91', "timestamp": new Date(data.createdTimestamp).toISOString(), "description": `React with ${cli.emojis.cache.get('686217948880568384')} to participate and ${cli.emojis.cache.get('686217948507275374')} if you have a key and are willing to pop!` };
	const headCountMsg = await vetAfkChannel.send({ embed });

	// ghostping here
	const mentionHere = await vetAfkChannel.send("@here");
	await mentionHere.delete();

	// react
	const headcountReactions = cfg.voidHcReactions;
	try {
		await headcountReactions.forEach(async reaction => { await headCountMsg.react(cli.emojis.cache.get(reaction)) });
	} catch(err) { console.error(err) };
	await data.channel.send(`Headcount started.`);
}

async function cultHC(cli, cfg, data){
	const vetAfkChannel = cli.channels.cache.get(cfg.fungalcavern.vetAfkchecks);
	const embed = { "title": "**Headcount for Cultist Hideout started by "+data.guild.members.cache.get(data.author.id).displayName+"!**", "color": '#990000', "timestamp": new Date(data.createdTimestamp).toISOString(), "description": `React with ${cli.emojis.cache.get('686217948918185994')} to participate and ${cli.emojis.cache.get('686217948507275374')} if you have a key and are willing to pop!` };
	const headCountMsg = await vetAfkChannel.send({ embed });

	// ghostping here
	const mentionHere = await vetAfkChannel.send("@here");
	await mentionHere.delete();

	// react
	const headcountReactions = cfg.cultHcReactions;
	try {
		await headcountReactions.forEach(async reaction => { await headCountMsg.react(cli.emojis.cache.get(reaction)) });
	} catch(err) { console.error(err) };
	await data.channel.send(`Headcount started.`);
}

async function fungalHC(cli, cfg, data){
	const vetAfkChannel = cli.channels.cache.get(cfg.fungalcavern.vetAfkchecks);
	const embed = { "title": "**Headcount for Fungal Cavern started by "+data.guild.members.cache.get(data.author.id).displayName+"!**", "color": '#074bb8', "timestamp": new Date(data.createdTimestamp).toISOString(), "description": `React with ${cli.emojis.cache.get('686223695827828774')} to participate and ${cli.emojis.cache.get('686223695798075449')} if you have a key and are willing to pop!` };
	const headCountMsg = await vetAfkChannel.send({ embed });

	// ghostping here
	const mentionHere = await vetAfkChannel.send("@here");
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
	const args = data.content.toLowerCase().split(' ');
	const typeofRuns = `Shatters (s), Void (v), Cult (c), Fungal (fc)`;

	if (!args[1]) return data.channel.send(`Please specify a type of run\nAvailables: ${typeofRuns}.`);

	// type of hcs
	if (args[1] == 'shatters' || args[1] == 's'){
		return shattsHC(cli, cfg, data);
	}

	if (args[1] == 'void' || args[1] == 'v'){
		return voidHC(cli, cfg, data);
	}

	if (args[1] == 'cult' || args[1] == 'c'){
		return cultHC(cli, cfg, data);
	}

	if (args[1] == 'fungal' || args[1] == 'fc'){
		return fungalHC(cli, cfg, data);
	}
}

module.exports = headcount;