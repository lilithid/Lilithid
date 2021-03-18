const afkArray = require('../../helpers/afkUpdater.js').afkArray;

async function location(cli, cfg, data){
	const args = data.content.split(' ');
	if (data.content.substr(args[0].length+1).length > 3){
		var location = data.content.substr(args[0].length+1);
		var authorafk = data.author.id;

		var afkObj;
		await afkArray.forEach(afk => { if (afk['host'] == authorafk) afkObj = afk; });

		if (afkObj == undefined) return data.channel.send(`You are not the host of any current afk check.`);
		// set location
		afkObj['location'] = location;
		await data.channel.send(`Location has been successfuly updated to ${location}.`);
		
		// pm key / nitro
		if (afkObj['key'] != undefined) afkObj['key'].send(`Location has been updated, it is now: \`${location}\``);
		if (afkObj['nitro'] && afkObj['nitro'].length > 0){
			for (x in afkObj['nitro']){
				await cli.users.cache.get(afkObj['nitro'][x]).send(`Location has been updated, it is now: \`${location}\``);
			}
		}
		
		if (afkObj['vial'] && afkObj['vial'].length > 0){
			for (x in afkObj['vial']){
				await cli.users.cache.get(afkObj['vial'][x]).send(`Location has been updated, it is now: \`${location}\``);
			}
		}

		if (afkObj['rusher'] && afkObj['rusher'].length > 0){
			for (x in afkObj['rusher']){
				await cli.users.cache.get(afkObj['rusher'][x]).send(`Location has been updated, it is now: \`${location}\``);
			}rusher
		}

	} else {
		return data.channel.send(`You need to enter a valid location to change to!\nUsage: \`-location [new location]\``);
	}
}

module.exports = location;