const vetAfkArray = require('../../helpers/vetAfkUpdater.js').vetAfkArray;

async function afkcheck(cli, cfg, data){
	const args = data.content.split(' ');

	// define the chan, type, location
	const goodChannelsToLead = ['656916239037497355', '656916792006148107'];
	if (!cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel || !goodChannelsToLead.includes(cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel.id)) return data.channel.send(`Please join any raiding channel and execute the command again.`);
	if (!args[1] || args[1].toLowerCase() != 's' && args[1].toLowerCase() != 'v' && args[1].toLowerCase() != 'c' && args[1].toLowerCase() != 'fc') return data.channel.send(`Specify the type of afk you're trying to use! ie. shatters (s), void (v), cult (c), fungal (fc).`);
	var location = data.content.substr(args[0].length+args[1].length+2);
	if (location.length < 3) return data.channel.send(`Set a valid location for the afk check!`);

	// define chan objects
	const vcChannel = cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel;
	const vcChannelNumber = cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel.name.replace(/[^0-9]/g, '').trim();
	const afkChannel = cli.channels.cache.get(cfg.fungalcavern.vetAfkchecks);
	const cpChannel = cli.channels.cache.get(cfg.fungalcavern.vetRlCommands);
	const shattersAfkReactions = [...cfg.shattersHcReactions, '760024870758776833', '760024884004388904', '760024527971024927'];
	const voidAfkReactions = [...cfg.voidHcReactions, '760024870758776833', '760024884004388904', '760024527971024927'];
	const cultAfkReactions = [...cfg.cultHcReactions, '760024870758776833', '760024884004388904', '760024527971024927'];
	const fungalAfkReactions = [...cfg.fungalHcReactions, '760024870758776833', '760024884004388904', '760024527971024927'];
 
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
		await cli.channels.cache.get(vcChannel.id).createOverwrite(cfg.fungalcavern.vetRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(vcChannel.id).setName(`${vcChannel.name} <-- Join!`);

		// push to the array the object and open reaction collector
		await vetAfkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/vetHandlers/shattersReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/vetHandlers/shattersReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new afk check in ${vcChannel.name} by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`);

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
		await cli.channels.cache.get(vcChannel.id).createOverwrite(cfg.fungalcavern.vetRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(vcChannel.id).setName(`${vcChannel.name} <-- Join!`);

		// push to the array the object and open reaction collector
		await vetAfkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/vetHandlers/voidReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/vetHandlers/voidReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new afk check in ${vcChannel.name} by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`);
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
		await cli.channels.cache.get(vcChannel.id).createOverwrite(cfg.fungalcavern.vetRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(vcChannel.id).setName(`${vcChannel.name} <-- Join!`);

		// push to the array the object and open reaction collector
		await vetAfkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/vetHandlers/cultReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/vetHandlers/cultReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new afk check in ${vcChannel.name} by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`);
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
		await cli.channels.cache.get(vcChannel.id).createOverwrite(cfg.fungalcavern.vetRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
		await cli.channels.cache.get(vcChannel.id).setName(`${vcChannel.name} <-- Join!`);

		// push to the array the object and open reaction collector
		await vetAfkArray.push(afkObj);
		const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/vetHandlers/fungalReactionCollector.js')(cli, cfg, afkReactionCollector);
		const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
		require('../../helpers/vetHandlers/fungalReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
		console.log(`Started a new afk check in ${vcChannel.name} by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`);
	}
	 else {
		return data.channel.send(`Unknown afk type! ie. shatters (s), void (v), cult (c), fungal (fc).`);
	}
}

module.exports = afkcheck;