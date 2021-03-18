const vetAfkArray = require('../vetAfkUpdater.js').vetAfkArray;

async function isInOtherClasses(userid, afkObj){
	var multiClass = false;
	if (afkObj['classes']['warrior'].includes(userid)) return multiClass = true;
	if (afkObj['classes']['paladin'].includes(userid)) return multiClass = true;
	if (afkObj['classes']['knight'].includes(userid)) return multiClass = true;
	if (afkObj['classes']['priest'].includes(userid)) return multiClass = true;
	if (afkObj['classes']['trickster'].includes(userid)) return multiClass = true;
	return false;
}

const powerCalculation = require('../../commands/commands.js').powerCalculation;

async function cultReactionCollector(cli, cfg, reactionCollector){

	reactionCollector.on('collect', async (reaction, user) => {
		// adding reactions, find the afk
		var afkObj;
		await vetAfkArray.forEach(afk => { if (afk['afkcheck'] == reaction.message.id) afkObj = afk; })
		if (user.bot) return;
		if (afkObj == undefined || afkObj['aborted'] || afkObj['ended']) return true;

		// easier
		var cpMsg;
		var afkMsg;
		cpMsg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.vetRlCommands).messages.fetch(afkObj['controlpanel']);
		afkMsg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.vetAfkchecks).messages.fetch(afkObj['afkcheck']);
		//

		if (cpMsg == undefined || afkMsg == undefined) return;

		if (reaction.emoji.id == '760021357076938782'){ // key
			if (afkObj['key'] == undefined){
				const keyMsg = await user.send(`You have reacted with ${cli.emojis.cache.find(e => e.id === "760021357076938782")}.\nIf you actually have a key, react with ✅ and if you made a mistake, ignore this message.`);
				await keyMsg.react('✅');
				const filter = (reaction, user) => reaction.emoji.name === '✅';
				await keyMsg.awaitReactions(filter, { max: 2, time: 30000 })
        		.then(async collected => {
           			// confirmed key, add temp key role then remove after 10m
           			if (collected.get('✅') != undefined && collected.get('✅').count == 2){
           				afkObj['key'] = user;
           				await user.send(`The raid leader has set the location to: ${afkObj['location']}. Please get there asap.\nYou are now our key popper. We ask that you check #parsemembers for raid leaders instructions.\n Please **ask** the current Raid Leader before kicking players listed in the channel.`);
           				await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.add(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.id == cfg.fungalcavern.tempKeyRole).id).catch(console.error);
           				setTimeout(async function(){ await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.remove(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.id == cfg.fungalcavern.tempKeyRole).id).catch(console.error); }, 300000);
           			}
           		})
			} else {
				await user.send(`We have enough keys for this run, but thanks for your participation.`);
			}
		} else if (reaction.emoji.id == '760021346871803924'){ // portal
			afkObj['raiders'] += 1;
			if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).voice.channelID != undefined) await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).voice.setChannel(cli.channels.cache.get(afkObj['channel'])).catch(err => console.error(err));
		} else if (reaction.emoji.id == '760021417391030274'){ // rusher
			if (afkObj['rusher'] != undefined && afkObj['rusher'].length < 2){
				const rusherMsg = await user.send(`You have reacted with ${cli.emojis.cache.find(e => e.id === "760021417391030274")}.\nIf you actually plan to rush, react with ✅ and if you made a mistake, ignore this message.`);
				await rusherMsg.react('✅');
				const filter = (reaction, user) => reaction.emoji.name === '✅';
				await rusherMsg.awaitReactions(filter, { max: 2, time: 30000 })
        		.then(async collected => {
           			// confirmed key, add temp key role then remove after 10m
           			if (collected.get('✅') != undefined && collected.get('✅').count == 2){
           				// check if has role
           				if(cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.cache.find(r => r.id == cfg.fungalcavern.rusherRole)) {
           					afkObj['rusher'].push(user.id);
           					await user.send(`The raid leader has set the location to: ${afkObj['location']}. Please get there asap.\nYou are now our rusher.`);
           				} else {
           					return user.send(`Sorry but you are not an official rusher and cannot get early location!`);
           				}
           			}
           		})
			} else {
				await user.send(`We have enough rushers for this run, but thanks for your participation.`);
			}
		} else if (reaction.emoji.id == '760021468863266817'){ // warrior
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('760021468863266817');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['warrior'].push(user.id);
			}
		} else if (reaction.emoji.id == '760021397832990750'){ // paladin
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('760021397832990750');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['paladin'].push(user.id);
			}
		} else if (reaction.emoji.id == '760021377042087977'){ // knight
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('760021377042087977');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['knight'].push(user.id);
			}
		} else if (reaction.emoji.id == '760021407366381578'){ // priest
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('760021407366381578');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['priest'].push(user.id);
			}
		} else if (reaction.emoji.id == '760021459380076555'){ // trickster
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('760021459380076555');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['trickster'].push(user.id);
			}
		} else if (reaction.emoji.id == '760024870758776833'){ // nitro
			// deaf and godly keypopper
			if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.cache.find(r => r.id == '635734565318688778') || cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.cache.find(r => r.id == '747022707895435284')){
				await user.send(`With your roles, you have access to early location: ${afkObj['location']}`).catch(() => cpMsg.channel.send(`${user} tried to react with nitro but I couldn't pm.`));
				return true;
			}
	
			if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.cache.find(r => r.id == cfg.fungalcavern.nitroRole)) { // nitro
				if (afkObj['nitro'].length > 4) return user.send(`Sorry but the nitro limit has been set to 5, you weren't fast enough!`);
				afkObj['nitro'].push(user.id);
				await user.send(`With your nitro, you have access to early location: ${afkObj['location']}`).catch(() => cpMsg.channel.send(`${user} tried to react with nitro but I couldn't pm.`));
				return true;
			}
			const reactN = reaction.message.reactions.cache.get('760024870758776833');
			if (user.bot) return;
			if (reactN != undefined) await reactN.users.remove(user).catch(error => console.error(err));
		} else if (reaction.emoji.id == '760024884004388904'){ // patreon
			if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.cache.find(r => r.id == cfg.fungalcavern.patreonRole)) { // patreon
				if (afkObj['patreon'].length > 4) return user.send(`Sorry but the patreon limit has been set to 5, you weren't fast enough!`);
				afkObj['patreon'].push(user.id);
				await user.send(`With your patreon support, you have access to early location: ${afkObj['location']}`).catch(() => cpMsg.channel.send(`${user} tried to react with patreon but I couldn't pm.`));
				return true;
			}
			const reactN = reaction.message.reactions.cache.get('760024884004388904');
			if (user.bot) return;
			if (reactN != undefined) await reactN.users.remove(user).catch(error => console.error(err));
		} else if (reaction.emoji.id == '760024527971024927'){ // stop
			if (await powerCalculation(cli, cfg, user.id) < 2){
				//cli.channels.get(cfg.fungalcavern.vetRlCommands).send(`${user} tried to react with stop but isn't allowed to.`);
				// remove stop reaction
				const reactX = reaction.message.reactions.cache.get('760024527971024927');
				if (user.bot) return;
				if (reactX != undefined) await reactX.users.remove(user).catch(error => console.error(err));
				return true;
			}
			if (reaction.message.reactions.cache.get('760024527971024927') != undefined) await reaction.message.reactions.cache.get('760024527971024927').remove().catch(error => console.error('Failed to remove reactions: ', error));
			if (cpMsg.reactions.cache.get('760024527971024927') != undefined) await cpMsg.reactions.cache.get('760024527971024927').remove().catch(error => console.error('Failed to remove reactions: ', error));
			if (!afkObj['postafk']){
				// normal to post afk (move out, lock)
				afkObj['postafk'] = true;
				afkObj['timeleft'] = 30;
				await reaction.message.react(cli.emojis.cache.get('760024527971024927'));

                // MOVE OUT
                var reactedPortal = [];
                var reactIDS = await afkMsg.reactions.cache.get('686223695827828774').users.fetch();
                for (var i of reactIDS){ reactedPortal.push(i[0]); }
                await cli.channels.cache.get(afkObj['channel']).members.forEach(async function(raiders){ if (!reactedPortal.includes(raiders.user.id) && await powerCalculation(cli, cfg, raiders.user.id) < 2) await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(raiders.user.id).voice.setChannel(cli.channels.cache.get('697216173938442340')).catch(err => console.error(err)); }) // Afk channel


				// lock the channel
				await cli.channels.cache.get(afkObj['channel']).createOverwrite(cfg.fungalcavern.vetRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': false, 'SPEAK': false });
   				await cli.channels.cache.get(afkObj['channel']).setName(cfg.fungalcavern.vetVc[afkObj['channelNumber']].name);
			}
			if (afkObj['postafk']){
				if (reaction.message.reactions.cache.get('760024527971024927') != undefined) await reaction.message.reactions.cache.get('760024527971024927').remove().catch(error => console.error('Failed to remove reactions: ', error));
				afkObj['ended'] = true; // post afk to ended
			}
		}
	})

	reactionCollector.on('remove', async (reaction, user) => {
		// removing reactions, find the afk
		var afkObj;
		await vetAfkArray.forEach(afk => { if (afk['afkcheck'] == reaction.message.id) afkObj = afk; })
		if (user.bot) return;
		if (afkObj == undefined || afkObj['aborted'] || afkObj['ended']) return true;

		// easier
		var cpMsg;
		var afkMsg;
		cpMsg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.vetRlCommands).messages.fetch(afkObj['controlpanel']);
		afkMsg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.vetAfkchecks).messages.fetch(afkObj['afkcheck']);
		//

		if (reaction.emoji.id == '760021357076938782'){ // key
			if (afkObj['key'] == user.id){
				user.send(`You have unreacted with ${cli.emojis.cache.find(e => e.id == "686217948507275374")}.\nPlease keep in mind that this is suspendable if it is fake react or abused.`)
				afkObj['key'] = undefined;
				cli.channels.cache.get(cfg.fungalcavern.vetRlCommands).send(`${user} unreacted from being the main ${cli.emojis.cache.find(e => e.id == "686217948507275374")}.`);
				await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.remove(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.id == cfg.fungalcavern.tempKeyRole).id).catch(console.error);
			}
		} else if (reaction.emoji.id == '686223695827828774'){ // portal
			afkObj['raiders'] -= 1;
		} else if (reaction.emoji.id == '760021417391030274'){ // rusher
			if (afkObj['rusher'].includes(user.id)){
				user.send(`You have unreacted with ${cli.emojis.cache.find(e => e.id == "760021417391030274")}.\nPlease keep in mind that this is suspendable if it is fake react or abused.`)
				let index = afkObj['rusher'].indexOf(user.id);
				if (index > -1) {
  					afkObj['rusher'].splice(index, 1);
				}
				cli.channels.cache.get(cfg.fungalcavern.vetRlCommands).send(`${user} unreacted from being ${cli.emojis.cache.find(e => e.id == "760021417391030274")}.`);
			}
		} else if (reaction.emoji.id == '760021468863266817'){ // warrior
			let index = afkObj['classes']['warrior'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['warrior'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '760021397832990750'){ // paladin
			let index = afkObj['classes']['paladin'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['paladin'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '760021377042087977'){ // knight
			let index = afkObj['classes']['knight'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['knight'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '760021407366381578'){ // priest
			let index = afkObj['classes']['priest'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['priest'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '760021459380076555'){ // trickster
			let index = afkObj['classes']['trickster'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['trickster'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '760024870758776833'){ // nitro
			let index = afkObj['nitro'].indexOf(user.id);
			if (index > -1) {
  				afkObj['nitro'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '760024884004388904'){ // patreon
			let index = afkObj['patreon'].indexOf(user.id);
			if (index > -1) {
  				afkObj['patreon'].splice(index, 1);
			}
		}
	})
}

async function controlPanelReactions(cli, cfg, reactionCollector){
	// handle aborting
	reactionCollector.on('collect', async (reaction, user) => {
		// adding reactions, find the afk
		var afkObj;
		await vetAfkArray.forEach(afk => { if (afk['afkcheck'] == reaction.message.id) afkObj = afk; })
		if (user.bot) return;
		if (afkObj == undefined || afkObj['aborted'] || afkObj['ended']) return true;

		if (reaction.emoji.id == '760024527971024927'){ // stop
			if (await powerCalculation(cli, cfg, user.id) < 2){
				cli.channels.get(cfg.fungalcavern.vetRlCommands).send(`${user} tried to react with stop but isn't allowed to.`);
				// remove stop reaction
				const reactX = reaction.message.reactions.cache.get('760024527971024927');
				if (user.bot) return;
				if (reactX != undefined) await reactX.users.remove(user).catch(error => console.error(err));
				return true;
			}
			if (reaction.message.reactions.cache.get('760024527971024927') != undefined) await reaction.message.reactions.cache.get('760024527971024927').remove().catch(error => console.error('Failed to remove reactions: ', error));
			afkObj['aborted'] = true;
		}
	})
}

module.exports = cultReactionCollector;
module.exports.controlPanelReactions = controlPanelReactions;