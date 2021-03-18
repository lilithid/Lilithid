const dbfindbyID = require('../db.js').findbyID;

async function stats(cli, cfg, data){
	// get user by ign and get his stats
	const fungalReact = cli.emojis.cache.get('686223695827828774');
	dbfindbyID(data.author.id, async function(result){
		if (result != undefined){
			const embed = {
  			"description": `${fungalReact} **__Statistics for ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).displayName} on Fungal Cavern:__** ${fungalReact}\n\n**__Runs Done:__** ${result.raiderRuns}\n**__Event Runs Done:__** ${result.eventRuns}\n\n**__Keys Popped:__** ${result.fungalPop}\n**__Event Keys Popped:__** ${result.eventPops}\n\n${fungalReact} **__Runs Led:__** ${fungalReact}\nSuccesful: ${result.successRuns}\nFailed: ${result.failedRuns}\nAssisted: ${result.assistedRuns}`,
  			"color": 166656,
  			"thumbnail": {
   				"url": `${data.author.avatarURL()}`
  			}
			};

			data.channel.send({ embed });
			data.react('✅');
		} else {
			data.channel.send(`Sorry but you are not verified and cannot see your stats!`);
		}
	})
}

module.exports = stats;