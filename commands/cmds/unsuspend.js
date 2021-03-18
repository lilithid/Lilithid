const { findbyIGN, findbyID } = require('../../db.js');
const dbUnsuspend = require('../../db.js').unsuspend;
const fetch = require('node-fetch');

const powerCalculation = require('../commands.js').powerCalculation;

async function continueUnsuspend(cli, cfg, data, args, raiderIGN){
	// calculate time and suspend
	if (args[0] && args[1]) var reasonSuspend = data.content.substr((args[0].length+args[1].length+2));
		// good

		if (reasonSuspend == undefined || reasonSuspend.length < 3){
			reasonSuspend = 'No reason specified.';
		}

		// suspend user, add role, log db, log channel (but first check if already suspended)
		findbyIGN(raiderIGN, async function(result){
			if (result == undefined){
				data.channel.send(`User was not found in the database! Please wait for next database update if he's in the server.`);
			} else {
			var userPower = powerCalculation(cli, cfg, result.id);
			var modPower = powerCalculation(cli, cfg, data.author.id);

			if (await userPower >= await modPower) {
				return data.channel.send(`You can't unsuspend someone higher or with the same role, you stoopid YEP`);
			} else {
				// doesn't have the role -> suspend
				await dbUnsuspend(cli, cfg, raiderIGN, result.id);
				await data.channel.send(`${cli.users.cache.get(result.id)} has succesfuly been unsuspended.`);
				const embed = {
					"title": `Unsuspension log for ${result.ign}.`,
					"description": `This suspension has been revoked.\nReason: ${reasonSuspend}`,
					"fields": [
						{
							"name":"Mods name",
							"value":`${data.author}`,
							"inline": true
						},
						{
							"name":"Users name",
							"value":`${cli.users.cache.get(result.id)}`,
							"inline": true
						}
					],
					"color": '#4ae607',
					"timestamp": new Date(data.createdTimestamp).toISOString(),
					"footer": {
					"text": `User ID: ${result.id}, Mod ID: ${data.author.id}`
				}
			};
			await cli.channels.cache.get(cfg.fungalcavern.suspensionLog).send({ embed });
		}			
		}
	})
}

async function suspend(cli, cfg, data){
	const args = data.content.split(' ');
	// arg1 verification
	let user = data.mentions.users.first();
	if (user) user = user.id;
	if (!user) user = args[1];
	if (user != args[1].replace(/\D/g,'')) user = args[1];
	if (!user) return data.channel.send(`Please input an ign, mention or specify an id.`);

	await continueUnsuspend(cli, cfg, data, args, user);
}

module.exports = suspend;