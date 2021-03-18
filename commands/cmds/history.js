const { getActionLog, findbyIGN } = require('../../db.js');

async function history(cli, cfg, data){
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
			// Check for: Bans, kicks, mutes, suspensions, warns
			await getActionLog(user, async function(logs){
				if (logs == undefined) return data.channel.send(`No previous actions found for this user.`);
				await data.channel.send(`Found ${logs.length} actions logged for this user.`);

				var bansMsg = ``, kicksMsg = ``, mutesMsg = ``, suspensionsMsg = ``, warnsMsg = ``;
				var bans = [], kicks = [], mutes = [], suspensions = [], warns = [];
				for (i = 0; i < logs.length; i++) {
					switch(logs[i].action.toLowerCase()){
						case 'ban':
							bans.push(logs[i]);
							bansMsg += `Mod: ${cli.users.cache.get(logs[i].modid)}, Reason: ${logs[i].reason}\n\n`;
							break;
						case 'kick':
							kicks.push(logs[i]);
							kicksMsg += `Mod: ${cli.users.cache.get(logs[i].modid)}, Reason: ${logs[i].reason}\n\n`;
							break;
						case 'mute':
							mutes.push(logs[i]);
							mutesMsg += `Mod: ${cli.users.cache.get(logs[i].modid)}, Reason: ${logs[i].reason}, Length: ${logs[i].length}\n\n`;
							break;
						case 'suspension':
							suspensions.push(logs[i]);
							suspensionsMsg += `Mod: ${cli.users.cache.get(logs[i].modid)}, Reason: ${logs[i].reason}, Length: ${logs[i].length}\n\n`;
							break;
						case 'warn':
							warns.push(logs[i]);
							warnsMsg += `Mod: ${cli.users.cache.get(logs[i].modid)}, Reason: ${logs[i].reason}\n\n`;
							break;
					}
				}

				// Formating
				if (bans.length == 0) bansMsg += `No ban logs found for this user.`;
				if (kicks.length == 0) kicksMsg += `No kick logs found for this user.`;
				if (mutes.length == 0) mutesMsg += `No mute logs found for this user.`;
				if (suspensions.length == 0) suspensionsMsg += `No suspension logs found for this user.`;
				if (warns.length == 0) warnsMsg += `No warn logs found for this user.`;

				// Output
				if (cli.users.cache.get(user)) { userNick = `${cli.users.cache.get(user).username}#${cli.users.cache.get(user).discriminator}`; } else {
					userNick = `${user}`;
				}
				
				const embed = {
					"title": `Actions found for ${userNick}.`,
					"description": `Please keep in mind some actions might have been revoked since then, and no log can be removed.`,
					"color": 789599,
					"fields": [
						{
							"name": `Bans`,
							"value": bansMsg
						},
						{
							"name": `Kicks`,
							"value": kicksMsg
						},
						{
							"name": `Mutes`,
							"value": mutesMsg
						},
						{
							"name": `Suspensions`,
							"value": suspensionsMsg
						},
						{
							"name": `Warns`,
							"value": warnsMsg
						},
					]
				};
				
				await data.channel.send({ embed });
			})
		}
	})
}

module.exports = history;