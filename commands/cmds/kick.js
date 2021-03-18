const powerCalculation = require('../commands.js').powerCalculation;
const { pushAction, findbyIGN } = require('../../db.js');

async function continueKick(cli, cfg, data, args, userIDD){
	if (args[0] && args[1]) var reasonKick = data.content.substr((args[0].length+args[1].length+2));
		// good

	if (reasonKick == undefined || reasonKick.length < 3){
		reasonKick = 'No reason specified.';
	}

	// suspend user, add role, log db, log channel (but first check if already suspended)
	var userPower = powerCalculation(cli, cfg, userIDD);
	var modPower = powerCalculation(cli, cfg, data.author.id);

	if (await userPower >= await modPower) {
		return data.channel.send(`You can't kick someone higher or with the same role, you stoopid YEP`);
	} else {
		await data.channel.send(`${cli.users.cache.get(userIDD)} has succesfuly been kicked.`);
		const embed = {
			"title": `Kick log ${userIDD}.`,
			"description": `Reason: ${reasonKick}`,
			"fields": [
				{
					"name":"Mods name",
					"value":`${data.author}`,
					"inline": true
				},
				{
					"name":"Users name",
					"value":`${cli.users.cache.get(userIDD)}`,
					"inline": true
				}
			],
			"color": '#f01707',
			"timestamp": new Date(data.createdTimestamp).toISOString(),
			"footer": {
				"text": `User ID: ${userIDD}, Mod ID: ${data.author.id}`
			}
		};

		await cli.channels.cache.get(cfg.fungalcavern.modlogs).send({ embed });
		await cli.users.cache.get(userIDD).send(`You have been kicked from Fungal Cavern.\nReason: ${reasonKick}`).catch(err => console.error(err));
		await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(userIDD).kick(reasonKick);
		await pushAction(userIDD, data.author.id, 'kick', reasonKick);
		}
}

async function kick(cli, cfg, data){
	const args = data.content.split(' ');
	// arg1 verification
	let user = data.mentions.users.first();
	if (user) user = user.id;
	if (!user) user = args[1];
	if (!user) return data.channel.send(`Please input an ign, mention or specify an id.`);

	await findbyIGN(user, async function(result){
		if (result == undefined){
			return data.channel.send(`Please input an ign, mention or specify an id.`);
		} else {
			user = result.id;
		}
		
		if (!cli.users.cache.get(user)) {
			return data.channel.send(`Please mention or specify a correct user ID`);
		} else {
			await continueKick(cli, cfg, data, args, user);
		}
	})
}

module.exports = kick;