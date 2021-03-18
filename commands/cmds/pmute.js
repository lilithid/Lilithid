const { pushAction, findbyIGN, findbyID } = require('../../db.js');
const dbMute = require('../../db.js').mute;
const fetch = require('node-fetch');

const powerCalculation = require('../commands.js').powerCalculation;

async function continueMute(cli, cfg, data, args, userIDD){
	// calculate time and suspend
	if (args[0] && args[1]) var reasonMute = data.content.substr((args[0].length+args[1].length+2));
		// good

		if (reasonMute == undefined || reasonMute.length < 3){
			reasonMute = 'No reason specified.';
		}

		// suspend user, add role, log db, log channel (but first check if already suspended)
		findbyID(userIDD, async function(result){
			var userPower = powerCalculation(cli, cfg, userIDD);
			var modPower = powerCalculation(cli, cfg, data.author.id);

			if (await userPower >= await modPower) {
				return data.channel.send(`You can't mute someone higher or with the same role, you stoopid YEP`);
			} else {
			if (result == undefined){
				await data.channel.send(`User was not found in the database! He was perma muted therefore.`);
				await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(userIDD).roles.add(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === 'Muted').id).catch(console.error);
				const embed = {
					"title": `Permanent mute log for ${userIDD}.`,
					"description": `This mute is permanent.\nReason: ${reasonMute}`,
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
			} else {
				// doesn't have the role -> suspend
				await dbMute(userIDD, '-1');
				await data.channel.send(`${cli.users.cache.get(result.id)} has succesfuly been muted permanently.`);
				const embed = {
					"title": `Permanent mute log for ${result.ign}.`,
					"description": `This mute is permanent.\nReason: ${reasonMute}`,
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
					"color": '#f01707',
					"timestamp": new Date(data.createdTimestamp).toISOString(),
					"footer": {
					"text": `User ID: ${result.id}, Mod ID: ${data.author.id}`
				}
			};
			await cli.channels.cache.get(cfg.fungalcavern.modlogs).send({ embed });
			await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(userIDD).roles.add(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === 'Muted').id).catch(console.error);
			await pushAction(userIDD, data.author.id, 'mute', reasonMute, 'Eternity');
			}
		}
	})
}

async function mute(cli, cfg, data){
	const args = data.content.split(' ');
	// arg1 verification
	let user = data.mentions.users.first();
	if (user) user = user.id;
	if (!user) user = args[1];
	if (!user) return data.channel.send(`Please input an ign, mention or specify an id.`);

	// find by ign
	await findbyIGN(user, async function(result){
		if (result == undefined){
			await continueMute(cli, cfg, data, args, user);
		} else {
			user = result.id;
			// profile not private
			await continueMute(cli, cfg, data, args, user);
		}
	})
}

module.exports = mute;