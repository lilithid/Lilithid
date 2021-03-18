const eventAfkArray = require('../../helpers/eventAfkUpdater.js').eventAfkArray;

async function location(cli, cfg, data){
	const args = data.content.split(' ');
	if (data.content.substr(args[0].length+1).length > 3){
		var location = data.content.substr(args[0].length+1);
		var authorafk = data.author.id;

		var eventAfkObj;
		await eventAfkArray.forEach(afk => { if (afk['host'] == authorafk) eventAfkObj = afk; });

		if (eventAfkObj == undefined) return data.channel.send(`You are not the host of any current afk check.`);
		// set location
		eventAfkObj['location'] = location;
		await data.channel.send(`Location has been successfuly updated to ${location}.`);
		
		// pm key / nitro
		if (eventAfkObj['key'] != undefined) eventAfkObj['key'].send(`Location has been updated, it is now: \`${location}\``);
		if (eventAfkObj['nitro'] && eventAfkObj['nitro'].length > 0){
			for (x in eventAfkObj['nitro']){
				await cli.users.cache.get(eventAfkObj['nitro'][x]).send(`Location has been updated, it is now: \`${location}\``);
			}
		}
		
		if (eventAfkObj['vial'] && eventAfkObj['vial'].length > 0){
			for (x in eventAfkObj['vial']){
				await cli.users.cache.get(eventAfkObj['vial'][x]).send(`Location has been updated, it is now: \`${location}\``);
			}
		}

		if (eventAfkObj['rusher'] && eventAfkObj['rusher'].length > 0){
			for (x in eventAfkObj['rusher']){
				await cli.users.cache.get(eventAfkObj['rusher'][x]).send(`Location has been updated, it is now: \`${location}\``);
			}rusher
		}

	} else {
		return data.channel.send(`You need to enter a valid location to change to!\nUsage: \`-location [new location]\``);
	}
}

module.exports = location;