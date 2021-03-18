const vetAfkArray = require('../../helpers/vetAfkUpdater.js').vetAfkArray;

async function location(cli, cfg, data){
	const args = data.content.split(' ');
	if (data.content.substr(args[0].length+1).length > 3){
		var location = data.content.substr(args[0].length+1);
		var authorafk = data.author.id;

		var vetAfkObj;
		await vetAfkArray.forEach(afk => { if (afk['host'] == authorafk) vetAfkObj = afk; });

		if (vetAfkObj == undefined) return data.channel.send(`You are not the host of any current afk check.`);
		// set location
		vetAfkObj['location'] = location;
		await data.channel.send(`Location has been successfuly updated to ${location}.`);
		
		// pm key / nitro
		if (vetAfkObj['key'] != undefined) vetAfkObj['key'].send(`Location has been updated, it is now: \`${location}\``);
		if (vetAfkObj['nitro'] && vetAfkObj['nitro'].length > 0){
			for (x in vetAfkObj['nitro']){
				await cli.users.cache.get(vetAfkObj['nitro'][x]).send(`Location has been updated, it is now: \`${location}\``);
			}
		}
		
		if (vetAfkObj['vial'] && vetAfkObj['vial'].length > 0){
			for (x in vetAfkObj['vial']){
				await cli.users.cache.get(vetAfkObj['vial'][x]).send(`Location has been updated, it is now: \`${location}\``);
			}
		}

		if (vetAfkObj['rusher'] && vetAfkObj['rusher'].length > 0){
			for (x in vetAfkObj['rusher']){
				await cli.users.cache.get(vetAfkObj['rusher'][x]).send(`Location has been updated, it is now: \`${location}\``);
			}rusher
		}

	} else {
		return data.channel.send(`You need to enter a valid location to change to!\nUsage: \`-location [new location]\``);
	}
}

module.exports = location;