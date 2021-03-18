const eventAfkArray = require('../../helpers/eventAfkUpdater.js').eventAfkArray;
const eventTypesCfg = require('./eventTypes.js');

async function afkcheck(cli, cfg, data){
	const args = data.content.split(' ');

	let eventTypes = ``;
	eventTypesCfg.forEach(function(eventType){
		eventTypes += `${eventType.name} (**${eventType.alias}**)\n`;
	})

	// define the chan, type, location
	const goodChannelsToLead = ['659857560588910602', '659857614292647956', '659857679254159371', '659857747487227905'];
	if (!cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel || !goodChannelsToLead.includes(cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel.id)) return data.channel.send(`Please join any raiding channel and execute the command again.`);
	if (!args[1] || args[1].toLowerCase() != 's' && args[1].toLowerCase() != 'v' && args[1].toLowerCase() != 'c' && args[1].toLowerCase() != 'fc') return data.channel.send(`Specify the type of afk you're trying to use! ie. shatters (s), void (v), cult (c), fungal (fc)\n\n**Events:** ${eventTypes}`);
	var location = data.content.substr(args[0].length+args[1].length+2);
	if (location.length < 3) return data.channel.send(`Set a valid location for the afk check!`);

	// define chan objects
	const vcChannel = cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel;
	const vcChannelNumber = cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel.name.replace(/[^0-9]/g, '').trim();
	const afkChannel = cli.channels.cache.get(cfg.fungalcavern.eventAfkchecks);
	const cpChannel = cli.channels.cache.get(cfg.fungalcavern.eventRlCommands);
	const shattersAfkReactions = [...cfg.shattersHcReactions, '760024870758776833', '760024884004388904', '760024527971024927'];
	const voidAfkReactions = [...cfg.voidHcReactions, '760024870758776833', '760024884004388904', '760024527971024927'];
	const cultAfkReactions = [...cfg.cultHcReactions, '760024870758776833', '760024884004388904', '760024527971024927'];
	const fungalAfkReactions = [...cfg.fungalHcReactions, '760024870758776833', '760024884004388904', '760024527971024927'];

	if (!cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel || cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel.id != vcChannel.id) return data.channel.send(`i'm not sure you want to afk in a channel you're not in, safety first buddy`); 
	// types
	if (args[1].toLowerCase() == "s" || args[1].toLowerCase() == "shatters"){
		// Shatters one
		const afkObj = {
			type: 'shatters',
			host: data.author.id,
			channel: vcChannel.id,
			channelNumber: vcChannelNumber,
			location: location,
			timeleft: 300,
			raiders: 0,
			started: new Date(data.createdTimestamp).toISOString(),
			key: undefined,
			nitro: [],
			patreon: [],
			classes: {
				warrior: [],
				paladin: [],
				knight: [],
				priest: [],
				mystic: [],
				assassin: [],
			},
			rushers: { first: [], second: [], secret: [] },
			afkcheck: undefined,
			controlpanel: undefined,
			postafk: false,
			ended: false,
			aborted: false
		};

		// edit undefined object variables
		const afkMsg = await afkChannel.send(`@here Shatters (${cli.emojis.cache.get('686223695827828774')}) started by ${cli.users.cache.get(afkObj['host'])} in ${vcChannel.name}!`);
		const cpMsg = await cpChannel.send(`AFK Check control panel for ${vcChannel.name}`);
		afkObj['afkcheck'] = afkMsg.id;
		afkObj['controlpanel'] = cpMsg.id;

		try {
			await shattersAfkReactions.forEach(async r => { await afkMsg.react(cli.emojis.cache.get(r))});
			await cpMsg.react(cli.emojis.cache.get('760024527971024927'));
		} catch(err) { console.error(err) };
		// unlock the channel
		await cli.channels.cache.get(vcChannel.id).createOverwrite(cfg.fungalcavern.eventRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(vcChannel.id).setName(`${vcChannel.name} <-- Join!`);

		// push to the array the object and open reaction collector
		await eventAfkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/eventHandlers/shattersReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/eventHandlers/shattersReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new event afk check in ${vcChannel.name} by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`);

	} else if (args[1].toLowerCase() == "v" || args[1].toLowerCase() == "void"){
		// Shatters one
		const afkObj = {
			type: 'void',
			host: data.author.id,
			channel: vcChannel.id,
			channelNumber: vcChannelNumber,
			location: location,
			timeleft: 300,
			raiders: 0,
			started: new Date(data.createdTimestamp).toISOString(),
			key: undefined,
			vial: [],
			nitro: [],
			patreon: [],
			classes: {
				warrior: [],
				paladin: [],
				knight: [],
			},
			afkcheck: undefined,
			controlpanel: undefined,
			postafk: false,
			ended: false,
			aborted: false
		};

		// edit undefined object variables
		const afkMsg = await afkChannel.send(`@here Void Entity (${cli.emojis.cache.get('686217948880568384')}) started by ${cli.users.cache.get(afkObj['host'])} in ${vcChannel.name}!`);
		const cpMsg = await cpChannel.send(`AFK Check control panel for ${vcChannel.name}`);
		afkObj['afkcheck'] = afkMsg.id;
		afkObj['controlpanel'] = cpMsg.id;
		try {
			await voidAfkReactions.forEach(async r => { await afkMsg.react(cli.emojis.cache.get(r))});
			await cpMsg.react(cli.emojis.cache.get('760024527971024927'));
		} catch(err) { console.error(err) };
		// unlock the channel
		await cli.channels.cache.get(vcChannel.id).createOverwrite(cfg.fungalcavern.eventRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(vcChannel.id).setName(`${vcChannel.name} <-- Join!`);

		// push to the array the object and open reaction collector
		await eventAfkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/eventHandlers/voidReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/eventHandlers/voidReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new event afk check in ${vcChannel.name} by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`);
	} else if (args[1].toLowerCase() == "c" || args[1].toLowerCase() == "cult"){
		// Shatters one
		const afkObj = {
			type: 'cult',
			host: data.author.id,
			channel: vcChannel.id,
			channelNumber: vcChannelNumber,
			location: location,
			timeleft: 300,
			raiders: 0,
			started: new Date(data.createdTimestamp).toISOString(),
			key: undefined,
			nitro: [],
			patreon: [],
			rusher: [],
			classes: {
				warrior: [],
				paladin: [],
				knight: [],
				priest: [],
			},
			afkcheck: undefined,
			controlpanel: undefined,
			postafk: false,
			ended: false,
			aborted: false
		};

		// edit undefined object variables
		const afkMsg = await afkChannel.send(`@here Cultist Hideout (${cli.emojis.cache.get('686217948918185994')}) started by ${cli.users.cache.get(afkObj['host'])} in ${vcChannel.name}!`);
		const cpMsg = await cpChannel.send(`AFK Check control panel for ${vcChannel.name}`);
		afkObj['afkcheck'] = afkMsg.id;
		afkObj['controlpanel'] = cpMsg.id;

		try {
			await cultAfkReactions.forEach(async r => { await afkMsg.react(cli.emojis.cache.get(r))});
			await cpMsg.react(cli.emojis.cache.get('760024527971024927'));
		} catch(err) { console.error(err) };
		// unlock the channel
		await cli.channels.cache.get(vcChannel.id).createOverwrite(cfg.fungalcavern.eventRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(vcChannel.id).setName(`${vcChannel.name} <-- Join!`);

		// push to the array the object and open reaction collector
		await eventAfkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/eventHandlers/cultReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/eventHandlers/cultReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new event afk check in ${vcChannel.name} by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`);
	} else if (args[1].toLowerCase() == "fc" || args[1].toLowerCase() == "fungal"){
		// Shatters one
		const afkObj = {
			type: 'fungal',
			host: data.author.id,
			channel: vcChannel.id,
			channelNumber: vcChannelNumber,
			location: location,
			timeleft: 300,
			raiders: 0,
			started: new Date(data.createdTimestamp).toISOString(),
			key: undefined,
			nitro: [],
			patreon: [],
			rusher: [],
			classes: {
				warrior: [],
				paladin: [],
				knight: [],
				priest: [],
				trickster: [],
			},
			afkcheck: undefined,
			controlpanel: undefined,
			postafk: false,
			ended: false,
			aborted: false
		};

		// edit undefined object variables
		const afkMsg = await afkChannel.send(`@here Fungal Cavern (${cli.emojis.cache.get('686223695827828774')}) started by ${cli.users.cache.get(afkObj['host'])} in ${vcChannel.name}!`);
		const cpMsg = await cpChannel.send(`AFK Check control panel for ${vcChannel.name}`);
		afkObj['afkcheck'] = afkMsg.id;
		afkObj['controlpanel'] = cpMsg.id;

		try {
			await fungalAfkReactions.forEach(async r => { await afkMsg.react(cli.emojis.cache.get(r))});
			await cpMsg.react(cli.emojis.cache.get('760024527971024927'));
		} catch(err) { console.error(err) };
		// unlock the channel
		await cli.channels.cache.get(vcChannel.id).createOverwrite(cfg.fungalcavern.eventRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(vcChannel.id).setName(`${vcChannel.name} <-- Join!`);

		// push to the array the object and open reaction collector
		await eventAfkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/eventHandlers/fungalReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/eventHandlers/fungalReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new event afk check in ${vcChannel.name} by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`);
	} else if (eventTypesCfg.filter(function(obj) { return obj.alias == args[1].toLowerCase(); }).length > 0){
		let eventTypeFound = eventTypesCfg.find(element => element.alias == args[1].toLowerCase());

		// Event one
		const afkObj = {
			type: 'event',
			host: data.author.id,
			channel: vcChannel.id,
			eventName: eventTypeFound.name,
			eventPortalID: eventTypeFound.portalID,
			eventKeyID: eventTypeFound.keyID,
			color: eventTypeFound.color,
			channelNumber: vcChannelNumber,
			location: location,
			timeleft: 300,
			raiders: 0,
			started: new Date(data.createdTimestamp).toISOString(),
			key: undefined,
			nitro: [],
			patreon: [],
			classes: {
				warrior: [],
				paladin: [],
				knight: [],
				priest: [],
			},
			afkcheck: undefined,
			controlpanel: undefined,
			postafk: false,
			ended: false,
			aborted: false
		};

		// edit undefined object variables
		const eventAfkReactions = [String(eventTypeFound.portalID), String(eventTypeFound.keyID), ...cfg.eventHcReactions, '760024870758776833', '760024884004388904', '760024527971024927'];
		const afkMsg = await afkChannel.send(`@here ${eventTypeFound.name} (${cli.emojis.cache.get(eventTypeFound.portalID)}) started by ${cli.users.cache.get(afkObj['host'])} in ${vcChannel.name}!`);
		const cpMsg = await cpChannel.send(`AFK Check control panel for ${vcChannel.name}`);
		afkObj['afkcheck'] = afkMsg.id;
		afkObj['controlpanel'] = cpMsg.id;

		try {
			await eventAfkReactions.forEach(async r => { await afkMsg.react(cli.emojis.cache.get(`${r}`))});
			await cpMsg.react(cli.emojis.cache.get('760024527971024927'));
		} catch(err) { console.error(err) };
		// unlock the channel
		await cli.channels.cache.get(vcChannel.id).createOverwrite(cfg.fungalcavern.eventRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(vcChannel.id).setName(`${vcChannel.name} <-- Join!`);

		// push to the array the object and open reaction collector
		await eventAfkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/eventHandlers/eventReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/eventHandlers/eventReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new event afk check in ${vcChannel.name} by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`);
	 } else {
		return data.channel.send(`Incorrect alias imput! ie. shatters (s), void (v), cult (c), fungal (fc)\n\n**Events:** ${eventTypes}`);
	}
}

module.exports = afkcheck;