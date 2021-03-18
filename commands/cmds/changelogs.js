const { logRun, popKey, findbyID, findbyIGN } = require('../../db.js');

async function changelogs(cli, cfg, data){
	const args = data.content.split(' ');

	// user verification
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
			// yep args verification
			if (args[2] != 'add' && args[2] != 'remove') return data.channel.send(`it needs to be add or remove sir BONK`);
			if (args[3] != 'a' && args[3] != 'p' && args[3] != 'f' && args[3] != 's') return data.channel.send(`it needs to be one of the p/a/f/s YEP`);
			if (args[4] && isNaN(args[4])) return data.channel.send(`if you specify an amount, atleast make it a number pepeHaw`);

			if (args[2] == 'add'){
				// add
				if (args[3] == 'p'){
					// add keypop
					if (!isNaN(args[4])) await popKey(user, args[4], 'fc');
					if (args[4] == undefined) await popKey(user, '1', 'fc');

					await findbyID(user, async function(result){
						return data.channel.send(`Succesfuly updated logs, ${cli.users.cache.get(user)} now has ${result.fungalPop} keypops.`);
					})
				} else if (args[3] == 'a'){
					// add assist
					if (!isNaN(args[4])) await logRun(user, args[4], 'assist');
					if (args[4] == undefined) await logRun(user, '1', 'assist');

					await findbyID(user, async function(result){
						return data.channel.send(`Succesfuly updated logs, ${cli.users.cache.get(user)} now has ${result.assistedRuns} assists.`);
					})
				} else if (args[3] == 'f'){
					// add fail
					if (!isNaN(args[4])) await logRun(user, args[4], 'fail');
					if (args[4] == undefined) await logRun(user, '1', 'fail');

					await findbyID(user, async function(result){
						return data.channel.send(`Succesfuly updated logs, ${cli.users.cache.get(user)} now has ${result.failedRuns} fails.`);
					})
				} else if (args[3] == 's'){
					// add success
					if (!isNaN(args[4])) await logRun(user, args[4], 'success');
					if (args[4] == undefined) await logRun(user, '1', 'success');

					await findbyID(user, async function(result){
						return data.channel.send(`Succesfuly updated logs, ${cli.users.cache.get(user)} now has ${result.successRuns} successes.`);
					})
				}
			} else if (args[2] == 'remove'){
				// remove
				if (args[3] == 'p'){
					// remove pop
					if (!isNaN(args[4])) await popKey(user, (+args[4]*-1), 'fc');
					if (args[4] == undefined) await popKey(user, '-1', 'fc');

					await findbyID(user, async function(result){
						return data.channel.send(`Succesfuly updated logs, ${cli.users.cache.get(user)} now has ${result.fungalPop} keypops.`);
					})
				} else if (args[3] == 'a'){
					// remove assist
					if (!isNaN(args[4])) await logRun(user, (+args[4]*-1), 'assist');
					if (args[4] == undefined) await logRun(user, '-1', 'assist');

					await findbyID(user, async function(result){
						return data.channel.send(`Succesfuly updated logs, ${cli.users.cache.get(user)} now has ${result.assistedRuns} assists.`);
					})
				} else if (args[3] == 'f'){
					// remove fail
					if (!isNaN(args[4])) await logRun(user, (+args[4]*-1), 'fail');
					if (args[4] == undefined) await logRun(user, '-1', 'fail');

					await findbyID(user, async function(result){
						return data.channel.send(`Succesfuly updated logs, ${cli.users.cache.get(user)} now has ${result.failedRuns} fails.`);
					})
				} else if (args[3] == 's'){
					// remove success
					if (!isNaN(args[4])) await logRun(user, (+args[4]*-1), 'success');
					if (args[4] == undefined) await logRun(user, '-1', 'success');

					await findbyID(user, async function(result){
						return data.channel.send(`Succesfuly updated logs, ${cli.users.cache.get(user)} now has ${result.successRuns} successes.`);
					})
				}
			}
		}
	})
}

module.exports = changelogs;