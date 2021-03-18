const fetch = require('node-fetch');
const { getModmailblacklistedUsers, insertmodmailblacklisted_user, unmodmailblacklist } = require('../../db.js');

async function feedbackblacklist(cli, cfg, data){
	// check if list add or remove
	const args = data.content.split(' ');
	if (args[1]) args[1] = args[1].toLowerCase();
	if (!args[1]) return data.channel.send(`Please specify add/remove/list!`);

	if (args[1] == 'list'){
		getModmailblacklistedUsers(async function(result){
			let modblacklistedNames = '';
			await result.forEach(user => modblacklistedNames+=`${user.id}, `);

			const embed = {
				"title": `All blacklisted from modmails users on the server!`,
				"description": `\n${modblacklistedNames}`,
				"color": 2900657,
				"timestamp": new Date(data.createdTimestamp).toISOString()
			};

			return data.channel.send({ embed });
		})
		return true;
	}

	// id verification
	let user = data.mentions.users.first();
	if (user) user = user.id;
	if (!user) user = args[2];
	if (!user) return data.channel.send(`Please mention or specify a correct ID`);
	if (!cli.users.cache.get(user) && args[1] != 'list') return data.channel.send(`Please mention or specify a correct user ID`);

	if (args[1] == 'add'){
		// add blacklist
		insertmodmailblacklisted_user(user);

		// log to modlogs
		const embed = {
			"title": `User ${user} was blacklisted from modmails by ${data.guild.members.cache.get(data.author.id).displayName}.`,
			"color": '#f01707',
			"timestamp": new Date(data.createdTimestamp).toISOString(),
			"footer": {
				"text": `Mod ID: ${data.author.id}`
			}
		};

		await cli.channels.cache.get(cfg.fungalcavern.modlogs).send({ embed });
		return data.channel.send(`Succesfuly blacklisted id ${user} from modmails.`)
	} else if (args[1] == 'remove'){
		// remove blacklist
		unmodmailblacklist(user);

		// log to modlogs
		const embed = {
			"title": `User ${user} was unblacklisted from modmails by ${data.guild.members.cache.get(data.author.id).displayName}.`,
			"color": '#4ae607',
			"timestamp": new Date(data.createdTimestamp).toISOString(),
			"footer": {
				"text": `Mod ID: ${data.author.id}`
			}
		};

		await cli.channels.cache.get(cfg.fungalcavern.modlogs).send({ embed });
		return data.channel.send(`Succesfuly unblacklisted id ${user} from modmails.`)
	} else if (args[1] != 'list') {
		// neither add remove or list
		return data.channel.send(`argument is invalid!`);
	}
}

module.exports = feedbackblacklist;