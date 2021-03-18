const powerCalculation = require('../commands.js').powerCalculation;
const latestVC = require(`../../main.js`).latestVC;

async function clear(cli, cfg, data){
	const args = data.content.toLowerCase().split(' ');

	if (!cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel) return data.channel.send(`You cannot execute the clear command because you are in no channel.`); 
	const clearMsg = await data.channel.send(`Clearing ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel.name.toLowerCase()}`);
	const vcRaiders = [];

	await cli.channels.cache.get(cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel.id).members.forEach(async function(raiders){
		vcRaiders.push(raiders);
	});

	for (let i = 0; i < vcRaiders.length; i++){
		if (latestVC[vcRaiders[i].user.id] == cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(vcRaiders[i].user.id).voice.channel.id) latestVC[vcRaiders[i].user.id] == undefined;
		if (await powerCalculation(cli, cfg, vcRaiders[i].user.id) < 2) await vcRaiders[i].voice.setChannel('659857838046314537').catch(err => console.error(err)); // lounge

		if (i == vcRaiders.length-1){
			await data.channel.send(`Finished clearing ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel.name.toLowerCase()}!`);
			await clearMsg.delete();
		}
	}

}

module.exports = clear;