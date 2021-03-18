const { fixDbName, isInDBID, findbyIGN, addActivity } = require('../../db.js');

async function fixname(cli, cfg, data){
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
			if (!args[2]) return data.channel.send(`Specify a name to change to!`);

			isInDBID(user, async function(result){
				if (result == true){
					let proofs;
					if (data.attachments.size > 0) proofs = data.attachments.first().url;
					if (!proofs) proofs = data.content.substr(args[0].length+args[1].length+args[2].length+3);
					if (!proofs) proofs = 'No proofs were providen.';

					const embed = {
						"title": `User ${user} was name changed.`,
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

					// change name and db update
					await fixDbName(user, args[2]);
					await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user).setNickname(args[2], `Reason: Fixname command issued.`).catch(err => console.error(err));
					await data.channel.send(`User was succesfuly renamed to ${args[2]}.`);
					await addActivity(data.author.id, 1);
				} else {
					return data.channel.send(`User is not verified and therefore cannot be name changed.`);
				}
			})
		}
	})
}

module.exports = fixname;