const { pushAction, findbyID, findbyIGN } = require('../../db.js');
const dbSuspend = require('../../db.js').suspend;
const fetch = require('node-fetch');

const powerCalculation = require('../commands.js').powerCalculation;

async function continueSuspend(cli, cfg, data, args, raiderIGN){
	// calculate time and suspend
	if (args[0] && args[1]) var reasonSuspend = data.content.substr((args[0].length+args[1].length+2));
		// good

		if (reasonSuspend == undefined || reasonSuspend.length < 3){
			reasonSuspend = 'No reason specified.';
		}

		// suspend user, add role, log db, log channel (but first check if already suspended)
		findbyIGN(raiderIGN, async function(result){
			if (result == undefined){
				data.channel.send(`User was not found in the database! Please wait for next database update if he's in the server and if he's verified.`);
			} else {
			if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id) == undefined){
				// left server
				await dbSuspend(raiderIGN, '-1');
				await data.channel.send(`${cli.users.cache.get(result.id)} has succesfuly been suspended permanently.`);
				const embed = {
				"title": `Suspension log for ${result.ign}.`,
					"description": `This suspension is permanent.\nReason: ${reasonSuspend}`,
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
				await cli.channels.cache.get(cfg.fungalcavern.suspensionLog).send({ embed });
				await pushAction(result.id, data.author.id, 'suspension', reasonSuspend, 'Eternity');
				return;
			}
			var userPower = powerCalculation(cli, cfg, result.id);
			var modPower = powerCalculation(cli, cfg, data.author.id);

			if (await userPower >= await modPower) {
				return data.channel.send(`You can't suspend someone higher or with the same role, you stoopid YEP`);
			} else {
				// found in db, check if has role
				if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id).roles.cache.some(r => [cfg.fungalcavern.pSuspendedRole, cfg.fungalcavern.suspendedRole].includes(r.id))){
					// warn suspended already
					const msgConfirmSus = await data.channel.send(`${cli.users.cache.get(result.id)} is already suspended, please verify if he's not permanently suspended and react with ✅ to bypass this warning.`);
					await msgConfirmSus.react('✅');
					const bypassCollector = msgConfirmSus.createReactionCollector((reaction, user) => {return !user.bot}, { time: 20000 });
					bypassCollector.on('collect', async (reaction, user) => {
					if (reaction.emoji.name == '✅' && user.id == data.author.id){
						// bypassed already suspended
						await msgConfirmSus.reactions.cache.get('✅').remove().catch(error => console.error('Failed to remove reactions: ', error));
							
						// suspend
						await dbSuspend(raiderIGN, '-1');
						await data.channel.send(`${cli.users.cache.get(result.id)} has succesfuly been suspended permanently.`);
						const embed = {
							"title": `Suspension log for ${result.ign}.`,
							"description": `This suspension is permanent.\nReason: ${reasonSuspend}`,
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
						await cli.channels.cache.get(cfg.fungalcavern.suspensionLog).send({ embed });
						await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id).roles.add(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === 'Permanent Suspension').id).catch(console.error);
						await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id).roles.remove(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === 'Verified Raider').id).catch(err => console.eror(err));
						await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id).roles.remove(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === 'Veteran Raider').id).catch(err => console.eror(err));
						await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id).roles.remove(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === 'Event Raider').id).catch(err => console.eror(err));
						await pushAction(result.id, data.author.id, 'suspension', reasonSuspend, 'Eternity');
					}
					})

					bypassCollector.on('end', async collected => {
						data.channel.send(`Too long to react, cancelled.`);
						await msgConfirmSus.reactions.cache.get('✅').remove().catch(error => console.error('Failed to remove reactions: ', error));
					});
			} else {
				// doesn't have the role -> suspend
				await dbSuspend(raiderIGN, '-1');
				await data.channel.send(`${cli.users.cache.get(result.id)} has succesfuly been suspended permanently.`);
				const embed = {
					"title": `Suspension log for ${result.ign}.`,
					"description": `This suspension is permanent.\nReason: ${reasonSuspend}`,
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
			await cli.channels.cache.get(cfg.fungalcavern.suspensionLog).send({ embed });
			await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id).roles.add(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === 'Suspended').id).catch(console.error);
			await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id).roles.remove(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === 'Verified Raider').id).catch(err => console.eror(err));
			await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id).roles.remove(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === 'Veteran Raider').id).catch(err => console.eror(err));
			await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id).roles.remove(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === 'Event Raider').id).catch(err => console.eror(err));
			await pushAction(result.id, data.author.id, 'suspension', reasonSuspend, 'Eternity');
		}			
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

	await continueSuspend(cli, cfg, data, args, user);
}

module.exports = suspend;