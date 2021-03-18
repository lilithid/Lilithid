const { pushAction, findbyIGN } = require('../../db.js');
const dbpushWarn = require('../../db.js').pushWarn;
const dbclearWarns = require('../../db.js').clearWarns;

async function warn(cli, cfg, data){
	// check user
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
			let reason = data.content.substr((args[0].length+args[1].length+2));
			// push into db
			if (reason.length < 2) return data.channel.send(`Please input a reason!`);

			// clear or add
			if (reason == 'clear'){
				await dbclearWarns(user);
				return data.channel.send(`Succesfuly cleared users warns.`);
			} else {
				await dbpushWarn(user, data.author.id, reason);
				await data.channel.send(`Succesfuly warned user ${cli.users.cache.get(user)} with reason: ${reason}.`);
				await cli.users.cache.get(user).send(`You have been warned from Fungal Cavern servers!\nReason: ${reason}`).catch(err => console.error(err));
				await pushAction(user, data.author.id, 'warn', reason);
			}
		}
	})
}

module.exports = warn;