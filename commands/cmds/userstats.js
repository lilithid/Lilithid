const dbfindbyID = require('../../db.js').findbyID;

async function userstats(cli, cfg, data){
	const args = data.content.split(' ');
	// arg1 verification
	let user = data.mentions.users.first();
	if (user) user = user.id;
	if (!user) user = args[1];
	if (!user) user = data.author.id;
	if (!user) return data.channel.send(`Please mention or specify a correct ID`);
	if (!cli.users.cache.get(user)) return data.channel.send(`Please mention or specify a correct user ID`);

	// get stats and embed
	const fungalReact = cli.emojis.cache.get('686223695827828774');
	await dbfindbyID(user, async function(result){
		if (result != undefined){
			const embed = {
  			"description": `${fungalReact} **__Statistics for ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).displayName} on Fungal Cavern:__** ${fungalReact}\n\n**__Runs Done:__** ${result.raiderRuns}\n**__Event Runs Done:__** ${result.eventRuns}\n\n**__Keys Popped:__** ${result.fungalPop}\n**__Event Keys Popped:__** ${result.eventPops}\n\n${fungalReact} **__Runs Led:__** ${fungalReact}\nSuccesful: ${result.successRuns}\nFailed: ${result.failedRuns}\nAssisted: ${result.assistedRuns}`,
  			"color": 166656,
  			"thumbnail": {
   				"url": `${cli.users.cache.get(user).displayAvatarURL()}`
  			}
			};
			await data.channel.send({ embed });
		} else {
			await data.channel.send(`Sorry but user is not verified, cannot see his stats!`);
		}
	})
}

module.exports = userstats;