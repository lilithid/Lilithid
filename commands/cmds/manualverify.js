const fetch = require('node-fetch');
const dbinsert_user = require('../../db.js').insert_user;
const {  } = require('../../db.js');

async function manualVerify(cli, cfg, data){
	const args = data.content.split(' ');
	// arg1 verification
	let user = data.mentions.users.first();
	if (user) user = user.id;
	if (!user) user = args[1];
	if (!user) return data.channel.send(`Please mention or specify a correct ID`);
	if (!cli.users.cache.get(user)) return data.channel.send(`Please mention or specify a correct user ID`);

	// ign verification
	if (!args[2]) return data.channel.send(`Please input a valid IGN!`);
	await continueVerify(cli, cfg, data, args, user);

}

async function continueVerify(cli, cfg, data, args, user){
	// proofs or not
	let proofs;
	if (data.attachments.size > 0) proofs = data.attachments.first().url;
	if (!proofs) proofs = data.content.substr(args[0].length+args[1].length+args[2].length+3);
	if (!proofs) proofs = 'No proofs were providen.';
	
	// log mod-mails
	const embed = {
		"title": `Manual verification for user ${args[2]}`,
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
	// verify name
	if (cli.users.cache.get(user).username == args[2]){
		args[2] = args[2].toLowerCase();
	}
	if (user.username == args[2]){
		args[2] = (args[2].charAt(0).toUpperCase()+args[2].slice(1));
	}
	// add role & change name
	await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user).roles.add(cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name === "Verified Raider").id).catch(console.error);
	await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user).setNickname(args[2], "Reason: Verification process.").catch(err => console.error(err));
	await dbinsert_user(user, args[2]);
	
	await cli.users.cache.get(user).send(`You have succesfuly been verified!`);
	await data.channel.send(`User was succesfuly verified!`);
}

module.exports = manualVerify;