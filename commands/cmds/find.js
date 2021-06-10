const { findbyID, findbyIGN } = require('../../db.js');

async function find(cli, cfg, data){
	const args = data.content.split(' ');
	if (!args[1]) return data.channel.send(`Specify atleast one user!`);

	// find foreach
	args.forEach(async raider => {
		if (raider == '*find') return;
		var raider = raider.toLowerCase().trim();
		await findbyIGN(raider, async function(result){
				// define all
				if (result == undefined) {
					data.channel.send({ embed: 
					{
						"description": `I could not find anyone in the server with: ${raider}.\nExpelled: N/A \| Suspended: N/A \| Voice Channel: N/A`,
						"color": '#db7209',
						"timestamp": new Date(data.createdTimestamp).toISOString()
					} 
					});
				} else {
					// server member i found
					if (result.suspendLength > 0){ isSuspended = '✅'; } else { isSuspended = '❌'; };
					try {
						if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id) == undefined) return data.channel.send({ embed: { "description": `This user left the server: [${result.ign.split('|')[0].trim()}](http://www.realmeye.com/player/${result.ign.split('|')[0].trim()}): <@${result.id}>.\nExpelled: ${isExpelledBoolean} \| Suspended: ${isSuspended}`, "color": '#ccccff', "timestamp": new Date(data.createdTimestamp).toISOString() }  });
						if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id).voice.channel != undefined){ isInVoiceChannel = `#${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id).voice.channel.name}`; } else { isInVoiceChannel = '❌'; };
					} catch(err){ console.error(err)}
					data.channel.send({ embed: 
						{
							"description": `Server member I found with the nickname [${result.ign.split('|')[0].trim()}](http://www.realmeye.com/player/${result.ign.split('|')[0].trim()}): <@${result.id}>.\nSuspended: ${isSuspended} \| Voice Channel: ${isInVoiceChannel}`,
							"color": '#06c783',
							"timestamp": new Date(data.createdTimestamp).toISOString(),
							"footer": {
								"text":`ID: ${result.id}`,
							}
						} 
					});
				}
		})
	})
}

module.exports = find;