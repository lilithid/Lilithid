const fetch = require('node-fetch');
const { addActivity, findbyIGN } = require('../../db.js');

async function commend(cli, cfg, data){
	const args = data.content.split(' ');
	if (!args[1]) return data.channel.send(`First argument must be one of: \`rusher\``);

	// args1
	if (args[1].toLowerCase() != 'rusher') return data.channel.send(`First argument must be one of: \`rusher\``);

	// arg2 verification
	let user = data.mentions.users.first();
	if (user) user = user.id;
	if (!user) user = args[2];
	if (!user) return data.channel.send(`Please input an ign, mention or specify an id.`);

	// find by ign
	await findbyIGN(user, async function(result){
		if (result == undefined){
			return data.channel.send(`Please input an ign, mention or specify an id.`);
		} else {
			user = result.id;
			// profile not private
			await continueCommend(cli, cfg, data, args, user, args[1]);
		}
	})

}

async function continueCommend(cli, cfg, data, args, user, roleToGive){
	// proofs or not
	let proofs;
	if (data.attachments.size > 0) proofs = data.attachments.first().url;
	if (!proofs) proofs = data.content.substr(args[0].length+args[1].length+args[2].length+3);
	if (!proofs) proofs = 'No proofs were providen.';

	// add role & change name
	if (roleToGive == 'rusher'){
		if (!cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user).roles.cache.some(r => r.name == "Master Miner")){
			// log mod-mails
			const embed = {
				"title": `Commend added for ${args[1]}`,
				"fields": [
					{
						"name":"Mods name",
						"value":`${data.author}`,
						"inline": true
					},
					{
						"name":"Raiders name",
						"value":`${cli.users.cache.get(user)}`,
						"inline": true
					},
					{
						"name":"Role",
						"value":`${roleToGive}`,
						"inline": true
					},
					{
						"name": "Proofs:",
						"value": `${proofs}`
					}
				],
				"color": 2900657,
				"timestamp": new Date(data.createdTimestamp).toISOString(),
				"footer": {
					"text": `User ID: ${user}, Mod ID: ${data.author.id}`
				}
			};

			if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(proofs)){
				embed.fields[2].value = `Image provided:`;
				embed.image = { "url": `${proofs}` };
			}

			await cli.channels.cache.get(cfg.fungalcavern.modlogs).send({ embed });
			await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user).roles.add(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === "Master Miner").id).catch(console.error);
			await data.channel.send(`User was succesfuly added the ${roleToGive} role!`);
			await addActivity(data.author.id, 1);
		} else {
			// log mod-mails
			const embed = {
				"title": `Commend removed for ${args[1]}`,
				"fields": [
					{
						"name":"Mods name",
						"value":`${data.author}`,
						"inline": true
					},
					{
						"name":"Raiders name",
						"value":`${cli.users.cache.get(user)}`,
						"inline": true
					},
					{
						"name":"Role",
						"value":`${roleToGive}`,
						"inline": true
					},
					{
						"name": "Proofs:",
						"value": `${proofs}`
					}
				],
				"color": 2900657,
				"timestamp": new Date(data.createdTimestamp).toISOString(),
				"footer": {
					"text": `User ID: ${user}, Mod ID: ${data.author.id}`
				}
			};

			if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(proofs)){
				embed.fields[2].value = `Image provided:`;
				embed.image = { "url": `${proofs}` };
			}

			await cli.channels.cache.get(cfg.fungalcavern.modlogs).send({ embed });
			await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user).roles.remove(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === "Master Miner").id).catch(console.error);
			await data.channel.send(`User was succesfuly removed from the ${roleToGive} role!`);
			await addActivity(data.author.id, 1);
		}
	}
}

module.exports = commend;