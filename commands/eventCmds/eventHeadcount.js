const eventTypesCfg = require('./eventTypes.js');

async function shattsHC(cli, cfg, data){
	const eventAfkChannel = cli.channels.cache.get(cfg.fungalcavern.eventAfkchecks);
	const embed = { "title": "**Headcount for Shatters started by "+data.guild.members.cache.get(data.author.id).displayName+"!**", "color": '#008502', "timestamp": new Date(data.createdTimestamp).toISOString(), "description": `React with ${cli.emojis.cache.get('686223695827828774')} to participate and ${cli.emojis.cache.get('679186891463196673')} if you have a key and are willing to pop!` };
	const headCountMsg = await eventAfkChannel.send({ embed });

	// ghostping here
	const mentionHere = await eventAfkChannel.send("@here");
	await mentionHere.delete();

	// react
	const headcountReactions = cfg.shattersHcReactions;
	try {
		await headcountReactions.forEach(async reaction => { await headCountMsg.react(cli.emojis.cache.get(reaction)) });
	} catch(err) { console.error(err) };
	await data.channel.send(`Headcount started for Shatters.`);
}

async function voidHC(cli, cfg, data){
	const eventAfkChannel = cli.channels.cache.get(cfg.fungalcavern.eventAfkchecks);
	const embed = { "title": "**Headcount for Void Entity started by "+data.guild.members.cache.get(data.author.id).displayName+"!**", "color": '#033a91', "timestamp": new Date(data.createdTimestamp).toISOString(), "description": `React with ${cli.emojis.cache.get('686217948880568384')} to participate and ${cli.emojis.cache.get('686217948507275374')} if you have a key and are willing to pop!` };
	const headCountMsg = await eventAfkChannel.send({ embed });

	// ghostping here
	const mentionHere = await eventAfkChannel.send("@here");
	await mentionHere.delete();

	// react
	const headcountReactions = cfg.voidHcReactions;
	try {
		await headcountReactions.forEach(async reaction => { await headCountMsg.react(cli.emojis.cache.get(reaction)) });
	} catch(err) { console.error(err) };
	await data.channel.send(`Headcount started for Void Entity.`);
}

async function cultHC(cli, cfg, data){
	const eventAfkChannel = cli.channels.cache.get(cfg.fungalcavern.eventAfkchecks);
	const embed = { "title": "**Headcount for Cultist Hideout started by "+data.guild.members.cache.get(data.author.id).displayName+"!**", "color": '#990000', "timestamp": new Date(data.createdTimestamp).toISOString(), "description": `React with ${cli.emojis.cache.get('686217948918185994')} to participate and ${cli.emojis.cache.get('686217948507275374')} if you have a key and are willing to pop!` };
	const headCountMsg = await eventAfkChannel.send({ embed });

	// ghostping here
	const mentionHere = await eventAfkChannel.send("@here");
	await mentionHere.delete();

	// react
	const headcountReactions = cfg.cultHcReactions;
	try {
		await headcountReactions.forEach(async reaction => { await headCountMsg.react(cli.emojis.cache.get(reaction)) });
	} catch(err) { console.error(err) };
	await data.channel.send(`Headcount started for Cultist Hideout.`);
}

async function fungalHC(cli, cfg, data){
	const eventAfkChannel = cli.channels.cache.get(cfg.fungalcavern.eventAfkchecks);
	const embed = { "title": "**Headcount for Fungal Cavern started by "+data.guild.members.cache.get(data.author.id).displayName+"!**", "color": '#074bb8', "timestamp": new Date(data.createdTimestamp).toISOString(), "description": `React with ${cli.emojis.cache.get('686223695827828774')} to participate and ${cli.emojis.cache.get('686223695798075449')} if you have a key and are willing to pop!` };
	const headCountMsg = await eventAfkChannel.send({ embed });

	// ghostping here
	const mentionHere = await eventAfkChannel.send("@here");
	await mentionHere.delete();

	// react
	const headcountReactions = cfg.fungalHcReactions;
	try {
		await headcountReactions.forEach(async reaction => { await headCountMsg.react(cli.emojis.cache.get(reaction)) });
	} catch(err) { console.error(err) };
	await data.channel.send(`Headcount started for Fungal Cavern.`);
}

async function allHC(cli, cfg, data){
	const eventAfkChannel = cli.channels.cache.get(cfg.fungalcavern.eventAfkchecks);
	const embed = { "title": "**Headcount for Random Events started by "+data.guild.members.cache.get(data.author.id).displayName+"!**", "color": '#074bb8', "timestamp": new Date(data.createdTimestamp).toISOString(), "description": `React with ${cli.emojis.cache.get('724851175718912020')} to participate and any of the keys if you have them and are willing to pop!` };
	const headCountMsg = await eventAfkChannel.send({ embed });
	const headCountMsgTwo = await eventAfkChannel.send('more options..');

	// ghostping here
	const mentionHere = await eventAfkChannel.send("@here");
	await mentionHere.delete();

	// react
	const allHeadcountReactionspartOne = ['724851175718912020', '724985334533718086', '725023985926012959', '725018825325805599', '724987558399836262', '724974092721061908', '724992895999803392', '724988888984322080', '724990686822268973', '724985358286192670', '725015100934586510', '725015680390266978', '724985323066753077', '724990661908103188', '725015067925676103', '725016303412445234', '724988237847855205', '724985348073193564', '724990643222609930', '724976837645828138'];
	const allHeadcountReactionspartTwo = ['725018836734312518', '724986646080258088', '725016292796530688', '724990699992514570', '724986656909688863', '724974077466378290', '725018857080750191', '725023985926012959', '724975945752117248', '724987926232170517', '724992921618612224', '725041490786648106', '725015080382496778', '724988901168644107', '725018846427086918', '724992910348648458', '724979168495927396', '724990675749175318', '725018804874248282', '725018814672011285'];
	try {
		await allHeadcountReactionspartOne.forEach(async reaction => { await headCountMsg.react(cli.emojis.cache.get(reaction)) });
		await allHeadcountReactionspartTwo.forEach(async reaction => { await headCountMsgTwo.react(cli.emojis.cache.get(reaction)) });
	} catch(err) { console.error(err) };
	await data.channel.send(`Headcount started for all dungeons.`);
}

async function eventHC(cli, cfg, data, eventName, eventColorHex, eventPortalID, eventKeyID){
	const eventAfkChannel = cli.channels.cache.get(cfg.fungalcavern.eventAfkchecks);
	const embed = { "title": `**Headcount for ${eventName} started by ${data.guild.members.cache.get(data.author.id).displayName}!**`, "color": eventColorHex, "timestamp": new Date(data.createdTimestamp).toISOString(), "description": `React with ${cli.emojis.cache.get(eventPortalID)} to participate and ${cli.emojis.cache.get(eventKeyID)} if you have a key and are willing to pop!` };
	const headCountMsg = await eventAfkChannel.send({ embed });

	// ghostping here
	const mentionHere = await eventAfkChannel.send("@here");
	await mentionHere.delete();

	// react
	const headcountReactions = [String(eventPortalID), String(eventKeyID), ...cfg.eventHcReactions];
	try {
		await headcountReactions.forEach(async reaction => { await headCountMsg.react(cli.emojis.cache.get(`${reaction}`)) });
	} catch(err) { console.error(err) };
	await data.channel.send(`Headcount started for ${eventName}.`);
}

/////////////////////////////////////////////////////////////////////////////////
async function headcount(cli, cfg, data){
	const args = data.content.toLowerCase().split(' ');

	let eventTypes = ``;
	eventTypesCfg.forEach(function(eventType){
		eventTypes += `${eventType.name} (**${eventType.alias}**)\n`;
	})

	const typeofRuns = `Shatters (s), Void (v), Cult (c), Fungal (fc), All (*)\n\n**Events:** ${eventTypes}`;

	if (!args[1]) return data.channel.send(`Please specify a type of run\nAvailables: ${typeofRuns}`);

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

	if (args[1] == 'all' || args[1] == '*'){
		return allHC(cli, cfg, data);
	}

	if (eventTypesCfg.filter(function(obj) { return obj.alias == args[1].toLowerCase(); }).length > 0){
		let eventTypeFound = eventTypesCfg.find(element => element.alias == args[1].toLowerCase());
		return eventHC(cli, cfg, data, eventTypeFound.name, eventTypeFound.color, eventTypeFound.portalID, eventTypeFound.keyID);
	}
}

module.exports = headcount;