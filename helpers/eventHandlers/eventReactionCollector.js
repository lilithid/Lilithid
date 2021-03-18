const eventAfkArray = require('../eventAfkUpdater.js').eventAfkArray;

async function isInOtherClasses(userid, afkObj){
	var multiClass = false;
	if (afkObj['classes']['warrior'].includes(userid)) return multiClass = true;
	if (afkObj['classes']['paladin'].includes(userid)) return multiClass = true;
	if (afkObj['classes']['knight'].includes(userid)) return multiClass = true;
	if (afkObj['classes']['priest'].includes(userid)) return multiClass = true;
	return false;
}

const powerCalculation = require('../../commands/commands.js').powerCalculation;

async function eventReactionCollector(cli, cfg, reactionCollector){

	reactionCollector.on('collect', async (reaction, user) => {
		// adding reactions, find the afk
		var afkObj;
		await eventAfkArray.forEach(afk => { if (afk['afkcheck'] == reaction.message.id) afkObj = afk; })
		if (user.bot) return;
		if (afkObj == undefined || afkObj['aborted'] || afkObj['ended']) return true;

		// easier
		var cpMsg;
		var afkMsg;
		cpMsg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.eventRlCommands).messages.fetch(afkObj['controlpanel']);
		afkMsg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.eventAfkchecks).messages.fetch(afkObj['afkcheck']);
		//

		if (cpMsg == undefined || afkMsg == undefined) return;

		if (reaction.emoji.id == afkObj['eventKeyID']){ // key
			if (afkObj['key'] == undefined){
				const keyMsg = await user.send(`You have reacted with ${cli.emojis.cache.find(e => e.id === afkObj['eventKeyID'])}.\nIf you actually have a key, react with ✅ and if you made a mistake, ignore this message.`);
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
		} else if (reaction.emoji.id == afkObj['eventPortalID']){ // portal
			afkObj['raiders'] += 1;
			if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).voice.channelID != undefined) await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).voice.setChannel(cli.channels.cache.get(afkObj['channel'])).catch(err => console.error(err));
		} else if (reaction.emoji.id == '679186994190090270'){ // warrior
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('679186994190090270');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['warrior'].push(user.id);
			}
		} else if (reaction.emoji.id == '679187006403903509'){ // paladin
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('679187006403903509');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['paladin'].push(user.id);
			}
		} else if (reaction.emoji.id == '679187016071512067'){ // knight
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('679187016071512067');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['knight'].push(user.id);
			}
		} else if (reaction.emoji.id == '679187025303437312'){ // priest
			if (await isInOtherClasses(user.id, afkObj)){
				await user.send(`Sorry but you cannot react with multiples classes at the same time.`);
				let reactClass = reaction.message.reactions.cache.get('679187025303437312');
				if (reactClass != undefined) await reactClass.users.remove(user).catch(error => console.error(err));
				return true;
			} else {
				await afkObj['classes']['priest'].push(user.id);
			}
		} else if (reaction.emoji.id == '686223984907255808'){ // nitro
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
			const reactN = reaction.message.reactions.cache.get('686223984907255808');
			if (user.bot) return;
			if (reactN != undefined) await reactN.users.remove(user).catch(error => console.error(err));
		} else if (reaction.emoji.id == '757312503775625229'){ // patreon
			if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.cache.find(r => r.id == cfg.fungalcavern.patreonRole)) { // patreon
				if (afkObj['patreon'].length > 4) return user.send(`Sorry but the patreon limit has been set to 5, you weren't fast enough!`);
				afkObj['patreon'].push(user.id);
				await user.send(`With your patreon support, you have access to early location: ${afkObj['location']}`).catch(() => cpMsg.channel.send(`${user} tried to react with patreon but I couldn't pm.`));
				return true;
			}
			const reactN = reaction.message.reactions.cache.get('757312503775625229');
			if (user.bot) return;
			if (reactN != undefined) await reactN.users.remove(user).catch(error => console.error(err));
		} else if (reaction.emoji.id == '699664632469782599'){ // stop
			if (await powerCalculation(cli, cfg, user.id) < 2){
				cli.channels.cache.get(cfg.fungalcavern.eventRlCommands).send(`${user} tried to react with stop but isn't allowed to.`);
				// remove stop reaction
				const reactX = reaction.message.reactions.cache.get('699664632469782599');
				if (user.bot) return;
				if (reactX != undefined) await reactX.users.remove(user).catch(error => console.error(err));
				return true;
			}
			if (reaction.message.reactions.cache.get('699664632469782599') != undefined) await reaction.message.reactions.cache.get('699664632469782599').remove().catch(error => console.error('Failed to remove reactions: ', error));
			if (cpMsg.reactions.cache.get('699664632469782599') != undefined) await cpMsg.reactions.cache.get('699664632469782599').remove().catch(error => console.error('Failed to remove reactions: ', error));
			if (!afkObj['postafk']){
				// normal to post afk (move out, lock)
				afkObj['postafk'] = true;
				afkObj['timeleft'] = 30;
				await reaction.message.react(cli.emojis.cache.get('699664632469782599'));

                // MOVE OUT
                var reactedPortal = [];
                var reactIDS = await afkMsg.reactions.cache.get('724695819818893342').users.fetch();
                for (var i of reactIDS){ reactedPortal.push(i[0]); }
                await cli.channels.cache.get(afkObj['channel']).members.forEach(async function(raiders){ if (!reactedPortal.includes(raiders.user.id) && await powerCalculation(cli, cfg, raiders.user.id) < 2) await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(raiders.user.id).voice.setChannel(cli.channels.cache.get('697216173938442340')).catch(err => console.error(err)); }) // Afk channel

				// lock the channel
				await cli.channels.cache.get(afkObj['channel']).createOverwrite(cfg.fungalcavern.vetRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': false, 'SPEAK': false });
   				await cli.channels.cache.get(afkObj['channel']).setName(cfg.fungalcavern.vetVc[afkObj['channelNumber']].name);
			}
			if (afkObj['postafk']){
				if (reaction.message.reactions.cache.get('699664632469782599') != undefined) await reaction.message.reactions.cache.get('699664632469782599').remove().catch(error => console.error('Failed to remove reactions: ', error));
				afkObj['ended'] = true; // post afk to ended
			}
		}
	})

	reactionCollector.on('remove', async (reaction, user) => {
		// removing reactions, find the afk
		var afkObj;
		await eventAfkArray.forEach(afk => { if (afk['afkcheck'] == reaction.message.id) afkObj = afk; })
		if (user.bot) return;
		if (afkObj == undefined || afkObj['aborted'] || afkObj['ended']) return true;

		// easier
		var cpMsg;
		var afkMsg;
		cpMsg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.eventRlCommands).messages.fetch(afkObj['controlpanel']);
		afkMsg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.eventAfkchecks).messages.fetch(afkObj['afkcheck']);
		//

		if (reaction.emoji.id == afkObj['eventKeyID']){ // key
			if (afkObj['key'] == user.id){
				user.send(`You have unreacted with ${cli.emojis.cache.find(e => e.id == afkObj['eventKeyID'])}.\nPlease keep in mind that this is suspendable if it is fake react or abused.`)
				afkObj['key'] = undefined;
				cli.channels.cache.get(cfg.fungalcavern.eventRlCommands).send(`${user} unreacted from being the main ${cli.emojis.cache.find(e => e.id == afkObj['eventKeyID'])}.`);
				await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.remove(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.id == cfg.fungalcavern.tempKeyRole).id).catch(console.error);
			}
		} else if (reaction.emoji.id == afkObj['eventPortalID']){ // portal
			afkObj['raiders'] -= 1;
		} else if (reaction.emoji.id == '679186994190090270'){ // warrior
			let index = afkObj['classes']['warrior'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['warrior'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '679187006403903509'){ // paladin
			let index = afkObj['classes']['paladin'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['paladin'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '679187016071512067'){ // knight
			let index = afkObj['classes']['knight'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['knight'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '679187025303437312'){ // priest
			let index = afkObj['classes']['priest'].indexOf(user.id);
			if (index > -1) {
  				afkObj['classes']['priest'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '686223984907255808'){ // nitro
			let index = afkObj['nitro'].indexOf(user.id);
			if (index > -1) {
  				afkObj['nitro'].splice(index, 1);
			}
		} else if (reaction.emoji.id == '757312503775625229'){ // patreon
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
		await eventAfkArray.forEach(afk => { if (afk['afkcheck'] == reaction.message.id) afkObj = afk; })
		if (user.bot) return;
		if (afkObj == undefined || afkObj['aborted'] || afkObj['ended']) return true;

		if (reaction.emoji.id == '699664632469782599'){ // stop
			if (await powerCalculation(cli, cfg, user.id) < 2){
				cli.channels.cache.get(cfg.fungalcavern.eventRlCommands).send(`${user} tried to react with stop but isn't allowed to.`);
				// remove stop reaction
				const reactX = reaction.message.reactions.cache.get('699664632469782599');
				if (user.bot) return;
				if (reactX != undefined) await reactX.users.remove(user).catch(error => console.error(err));
				return true;
			}
			if (reaction.message.reactions.cache.get('699664632469782599') != undefined) await reaction.message.reactions.cache.get('699664632469782599').remove().catch(error => console.error('Failed to remove reactions: ', error));
			afkObj['aborted'] = true;
		}
	})
}

module.exports = eventReactionCollector;
module.exports.controlPanelReactions = controlPanelReactions;