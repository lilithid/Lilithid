const openVetVeris = [];
const { addActivity } = require('../db.js');
const Discord = require('discord.js');

async function vetveripending(cli, cfg){
	cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.vetveripending).messages.fetch({ limit: 100 })
  		.then(async messages => {
  			const vetveripendings = messages.filter(m => m.embeds.length > 0 && !openVetVeris.includes(m.id));
  			// check key and open collectors
  			await vetveripendings.forEach(async msg => {
  				if (msg.reactions.cache.get('🔑') == undefined && msg.reactions.cache.get('💯') == undefined && msg.reactions.cache.get('👋') == undefined && msg.reactions.cache.get('✅') == undefined && msg.reactions.cache.get('❌') == undefined) await msg.react('🔑');
  				// push it to open vetveripendings and open collector
  				openVetVeris.push(msg.id);
  				const vetveripendingCollector = msg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, limit: 2 });
				vetveripendingCollector.on('collect', async (reaction, user) => {
					const reacts = ['✅', '❌', '🔒'];

					const AuthorUserIgn = msg.embeds[0].title.split(':')[1].replace('!', '').trim();
					const AuthorUserId = msg.embeds[0].description.split("'")[0].replace(/<@/g, '').replace(/>/g, '').replace(/!/g, '');

					if (user.bot) return;
					switch (reaction.emoji.name){
						case '🔑':
							// react to all and remove key
							await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
							await reacts.forEach(async reaction => await msg.react(reaction));
							break;
						case '✅':
							await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
							let embedOne = new Discord.MessageEmbed(msg.embeds[0]);
							embedOne.setFooter(`Accepted by ${msg.guild.members.cache.get(user.id).displayName}`);
							embedOne.setColor(8311585);
							await msg.edit({ embed: embedOne });
							await cli.users.cache.get(AuthorUserId).send({ embed: {
								"title": "Verification Updates",
								"color": 8311585,
								"description": `You were veteran verified by ${user}\nPlease take time to read our veteran <#656926813771137064> before going in any run.`
							}});

							await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(AuthorUserId).roles.add(cfg.fungalcavern.vetRaiderRole).catch(console.error);
							await msg.react('💯');
							await addActivity(user.id, 3);
							break;
						case '❌':
							let embedTwo = new Discord.MessageEmbed(msg.embeds[0]);
							await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
							embedTwo.setFooter(`Denied by ${msg.guild.members.cache.get(user.id).displayName}`);
							embedTwo.setColor(13632027);
							await msg.edit({ embed: embedTwo });
							await cli.users.cache.get(AuthorUserId).send({ embed: {
								"title": "Verification Updates",
								"color": 13632027,
								"description": `You were denied veteran verification, please reapply once you have enough 8/8's and 50 completed runs.`
							}});
							await msg.react('👋');
							await addActivity(user.id, 3);
							break;
						case '🔒':
							await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
							await msg.react('🔑');
							break;
					}
				})
  			})
  		})
}

module.exports = vetveripending;