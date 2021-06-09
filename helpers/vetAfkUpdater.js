const vetAfkArray = [];
const dbrunDone = require('../db.js').runDone;
const dbpopKey = require('../db.js').popKey;
const powerCalculation = require('../commands/commands.js').powerCalculation;

async function vetAfkUpdater(cli, cfg){
	// update all afks
	await vetAfkArray.forEach(async afk => {
		const afkMsg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.vetAfkchecks).messages.fetch(afk['afkcheck']);
		const cpMsg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.vetRlCommands).messages.fetch(afk['controlpanel']);
		if (afkMsg == undefined || cpMsg == undefined) return;

		// setup directory
		var directoryEmbed;
		if (afk['type'] == 'shatters') directoryEmbed = `shattersEmbeds`;
		if (afk['type'] == 'void') directoryEmbed = `voidEmbeds`;
		if (afk['type'] == 'cult') directoryEmbed = `cultEmbeds`;
		if (afk['type'] == 'fungal') directoryEmbed = `fungalEmbeds`;

		// setup portal reaction
		var portalReact;
		if (afk['type'] == 'shatters') portalReact = `760021427545440276`; // shatters portal
		if (afk['type'] == 'void') portalReact = `760023745787068446`; // void portal
		if (afk['type'] == 'cult') portalReact = `760023730528190495`; // cult portal
		if (afk['type'] == 'fungal') portalReact = `760021346871803924`; // fungal portal

		afk['timeleft'] -= 5;

		// handle embeds
		if (!afk['aborted']){
			if (!afk['ended']){
				if (afk['timeleft'] <= 0){
					if (!afk['postafk']){
						// move out, normal -> post afk
						if (afkMsg.reactions.cache.get('760024527971024927') != undefined) await afkMsg.reactions.cache.get('760024527971024927').remove().catch(error => console.error('Failed to remove reactions: ', error));
						if (cpMsg.reactions.cache.get('760024527971024927') != undefined) await cpMsg.reactions.cache.get('760024527971024927').remove().catch(error => console.error('Failed to remove reactions: ', error));
						await afkMsg.react(cli.emojis.cache.get('760024527971024927'));
						afk['postafk'] = true;
						afk['timeleft'] = 30;

						// Move out to afk
						var reactedPortal = [];
						var reactIDS = await afkMsg.reactions.cache.get(portalReact).users.fetch();
						for (var i of reactIDS){ reactedPortal.push(i[0]); }
						await cli.channels.cache.get(afk['channel']).members.forEach(async function(raiders){ if (!reactedPortal.includes(raiders.user.id) && await powerCalculation(cli, cfg, raiders.user.id) < 2) await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(raiders.user.id).voice.setChannel(cli.channels.cache.get(cfg.fungalcavern.vetVc[0].id)).catch(err => console.error(err)); }) // Vet Lounge

						// locks the channel
						await cli.channels.cache.get(afk['channel']).createOverwrite(cfg.fungalcavern.vetRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': false, 'SPEAK': false });
   						await cli.channels.cache.get(afk['channel']).setName(cfg.fungalcavern.vetVc[afk['channelNumber']].name);
					} else {
						// post afk -> ended
						if (afkMsg.reactions.cache.get('760024527971024927') != undefined) await afkMsg.reactions.cache.get('760024527971024927').remove().catch(error => console.error('Failed to remove reactions: ', error));
						afk['ended'] = true;
					}
				} else {
					if (!afk['postafk']){
						// normal embed
						let afkEmbed = await require(`./${directoryEmbed}/updateNormalAfkEmbed.js`)(cli, cfg, afk);
						let cpEmbed = await require(`./${directoryEmbed}/updateNormalCPEmbed.js`)(cli, cfg, afk);
						await afkMsg.edit({ embed: afkEmbed });
						await cpMsg.edit('', { embed: cpEmbed });

					} else {
						// post afk embed
						let afkEmbed = await require(`./${directoryEmbed}/updatePostAfkEmbed.js`)(cli, cfg, afk);
						let cpEmbed = await require(`./${directoryEmbed}/updatePostCPEmbed.js`)(cli, cfg, afk);
						await afkMsg.edit({ embed: afkEmbed });
						await cpMsg.edit('', { embed: cpEmbed });
					}
				}
			} else {
				// ended embed then remove from afk array
				let afkEmbed = await require(`./${directoryEmbed}/updateEndedAfkEmbed.js`)(cli, cfg, afk);
				let cpEmbed = await require(`./${directoryEmbed}/updateEndedCPEmbed.js`)(cli, cfg, afk);
				await afkMsg.edit('', { embed: afkEmbed });
				await cpMsg.edit('', { embed: cpEmbed });

				// auto logging runs done + key
				var reactIDS = await afkMsg.reactions.cache.get(portalReact).users.fetch();
				if (afk['key']) await cpMsg.channel.send(`<@${afk['key'].id}> has popped a key, make sure to log it!`)

				let index = vetAfkArray.indexOf(afk);
				if (index > -1) {
  					vetAfkArray.splice(index, 1);
				}
				console.log(`removed afk from array because: Ended`);
			}
		} else {
			// aborted embed then remove from afk array
			let afkEmbed = await require(`./${directoryEmbed}/updateAbortedAfkEmbed.js`)(cli, cfg, afk);
			let cpEmbed = await require(`./${directoryEmbed}/updateAbortedCPEmbed.js`)(cli, cfg, afk);
			await afkMsg.edit('', { embed: afkEmbed });
			await cpMsg.edit('', { embed: cpEmbed });

			// lock channel
			await cli.channels.cache.get(afk['channel']).createOverwrite(cfg.fungalcavern.vetRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': false, 'SPEAK': false });
   			await cli.channels.cache.get(afk['channel']).setName(cfg.fungalcavern.vetVc[afk['channelNumber']].name);

   			// remove from array
			let index = vetAfkArray.indexOf(afk);
			if (index > -1) {
  				vetAfkArray.splice(index, 1);
			}
			if (afkMsg.reactions.cache.get('760024527971024927') != undefined) await afkMsg.reactions.cache.get('760024527971024927').remove().catch(error => console.error('Failed to remove reactions: ', error));
			console.log(`removed afk from array because: Aborted`);
		}
	})
}

module.exports = vetAfkUpdater;
module.exports.vetAfkArray = vetAfkArray;