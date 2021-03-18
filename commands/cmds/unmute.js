const { findbyID, findbyIGN } = require('../../db.js');
const dbUnmute = require('../../db.js').unmute;
const fetch = require('node-fetch');

const powerCalculation = require('../commands.js').powerCalculation;

async function continueUnmute(cli, cfg, data, args, userIDD){
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
				return data.channel.send(`You can't unsuspend someone higher or with the same role, you stoopid YEP`);
			} else {
			if (result == undefined){
				data.channel.send(`User was not found in the database! He was unmuted although.`);
				cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(userIDD).roles.remove(cfg.fungalcavern.mutedRole).catch(err => console.eror(err));
			} else {
				// doesn't have the role -> suspend
				await dbUnmute(cli, cfg, userIDD);
				await data.channel.send(`${cli.users.cache.get(result.id)} has succesfuly been unmuted.`);
				const embed = {
					"title": `Unmute log for ${result.ign}.`,
					"description": `This mute has been revoked.\nReason: ${reasonMute}`,
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
			await cli.channels.cache.get(cfg.fungalcavern.modlogs).send({ embed });
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
			return data.channel.send(`Please input an ign, mention or specify an id.`);
		} else {
			user = result.id;
			// profile not private
			await continueUnmute(cli, cfg, data, args, user);
		}
	})
}

module.exports = mute;