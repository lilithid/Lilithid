const openVeris = [];
const { addActivity, insert_user, unexpelUser } = require('../db.js');
const Discord = require('discord.js');

async function veriPending(cli, cfg){
	cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.veripending).messages.fetch({ limit: 100 })
  		.then(async messages => {
  			const veripendings = messages.filter(m => m.embeds.length > 0 && !openVeris.includes(m.id));
  			// check key and open collectors
  			await veripendings.forEach(async msg => {
  				if (msg.reactions.cache.get('🔑') == undefined && msg.reactions.cache.get('💯') == undefined && msg.reactions.cache.get('👋') == undefined && msg.reactions.cache.get('✅') == undefined && msg.reactions.cache.get('❌') == undefined) await msg.react('🔑');
  				// push it to open veripendings and open collector
  				openVeris.push(msg.id);
  				const veriPendingCollector = msg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, limit: 2 });
				veriPendingCollector.on('collect', async (reaction, user) => {
					const reacts = ['✅', '❌', '🔒'];
					const denyReacts = ['1⃣', '2⃣', '🔒'];

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
								"description": `You were verified by ${user}.`
							}});
							
							await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(AuthorUserId).roles.add(cfg.fungalcavern.raiderRole).catch(console.error);
							await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(AuthorUserId).setNickname(AuthorUserIgn, "Reason: Verification process.").catch(err => console.error(err));
							await insert_user(AuthorUserId, AuthorUserIgn);
							await unexpelUser(AuthorUserIgn);
							await msg.react('💯');
							await addActivity(user.id, 3);
							break;
						case '❌':
							await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
							await denyReacts.forEach(async reaction => await msg.react(reaction));
							break;
						case '1⃣':
							let embedTwo = new Discord.MessageEmbed(msg.embeds[0]);
							await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
							embedTwo.setFooter(`Denied by ${msg.guild.members.cache.get(user.id).displayName} using 1`);
							embedTwo.setColor(13632027);
							await msg.edit({ embed: embedTwo });
							await cli.users.cache.get(AuthorUserId).send({ embed: {
								"title": "Verification Updates",
								"color": 13632027,
								"description": `You were denied by <@!${user.id}>, please directly message them.`
							}});
							await msg.react('👋');
							await addActivity(user.id, 3);
							break;
						case '2⃣':
							let embedThree = new Discord.MessageEmbed(msg.embeds[0]);
							await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
							embedThree.setFooter(`Denied by ${msg.guild.members.cache.get(user.id).displayName} using 2`);
							embedThree.setColor(13632027);
							await msg.edit({ embed: embedThree });
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

module.exports = veriPending;