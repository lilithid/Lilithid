const afkArray = require('../../helpers/afkUpdater.js').afkArray;

async function afkcheck(cli, cfg, data){
	const args = data.content.split(' ');

	// define the chan, type, location
	const goodChannelsToLead = ['635542462525472809', '635542647788011521', '635547598668955709', '698467094118924388', '698467148476973097', '698516581709250590', '698517529899040858'];
	if (!cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel || !goodChannelsToLead.includes(cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel.id)) return data.channel.send(`Please join any raiding channel and execute the command again.`);
	var location = data.content.substr(args[0].length+1);
	if (location.length < 3) return data.channel.send(`Set a valid location for the afk check!`);

	// define chan objects
	const vcChannel = cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel;
	const vcChannelNumber = cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel.name.replace(/[^0-9]/g, '').trim();
	const afkChannel = cli.channels.cache.get(cfg.fungalcavern.afkchecks);
	const cpChannel = cli.channels.cache.get(cfg.fungalcavern.rlcommands);
	const fungalAfkReactions = [...cfg.fungalHcReactions, '760024870758776833', '760024884004388904', '760024527971024927'];

	// Fungal one
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
	await cli.channels.cache.get(vcChannel.id).createOverwrite(cfg.fungalcavern.raiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': true, 'SPEAK': false });
	await cli.channels.cache.get(vcChannel.id).setName(`${vcChannel.name} <-- Join!`);

	// push to the array the object and open reaction collector
	await afkArray.push(afkObj);
	const afkReactionCollector = afkMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
	require('../../helpers/regHandlers/fungalReactionCollector.js')(cli, cfg, afkReactionCollector);
	const cpReactionCollector = cpMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, dispose: true });
	require('../../helpers/regHandlers/fungalReactionCollector.js').controlPanelReactions(cli, cfg, cpReactionCollector);
	console.log(`Started a new afk check in ${vcChannel.name} by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(afkObj['host']).displayName}`);
}

module.exports = afkcheck;