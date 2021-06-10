const fetch = require('node-fetch');
const { , findbyIGN } = require('../../db.js');

async function vetVerify(cli, cfg, data){
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
			await continueVetVerify(cli, cfg, data, args, user);
		}
	})

}

async function continueVetVerify(cli, cfg, data, args, user){
	// proofs or not
	let proofs;
	if (data.attachments.size > 0) proofs = data.attachments.first().url;
	if (!proofs) proofs = data.content.substr(args[0].length+args[1].length+2);
	if (!proofs) proofs = 'No proofs were providen.';
	
	// log mod-mails
	const embed = {
		"title": `Veteran verification for user ${args[1]}`,
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

	// add role & change name
	await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user).roles.add(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === "Veteran Raider").id).catch(console.error);
	
	await cli.users.cache.get(user).send(`You have been added the veteran role!`);
	await data.channel.send(`User was succesfuly added veteran role!`);
}

module.exports = vetVerify;