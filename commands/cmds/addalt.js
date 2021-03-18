const { addAlt, findbyIGN, addActivity } = require('../../db.js');
const fetch = require('node-fetch');

async function addAltFunction(cli, cfg, data){
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
			if (!args[2]) return data.channel.send(`Please input a valid IGN!`);
			await continueAddAlt(cli, cfg, data, args, user);
		}
	})
}

async function continueAddAlt(cli, cfg, data, args, user){
	let proofs;
	if (data.attachments.size > 0) proofs = data.attachments.first().url;
	if (!proofs) proofs = data.content.substr(args[0].length+args[1].length+args[2].length+3);
	if (!proofs) proofs = 'No proofs were providen.';

	// log to modlogs and db functions
	const embed = {
		"title": `Alt account added for ${args[2]}.`,
		"fields": [
			{
				"name":"Mods name",
				"value":`${data.author}`,
				"inline": true
			},
			{
				"name":"Users name",
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
	await addAlt(user, args[2]);
	await data.channel.send(`Succesfuly added the alt account.`);
	await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user).setNickname(`${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user).displayName} | ${args[2]}`);
	await addActivity(data.author.id, 2);
}

module.exports = addAltFunction;