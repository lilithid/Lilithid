const openModmails = require('../main.js').openModmails;
const insertmodmailblacklisted_user = require('../db.js').insertmodmailblacklisted_user;

async function modmailReactions(cli, cfg){
	cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.modmail).messages.fetch({ limit: 100 })
  		.then(async messages => {
  			const modmails = messages.filter(m => m.embeds.length > 0 && !openModmails.includes(m.id));
  			// check key and open collectors
  			await modmails.forEach(async msg => {
  				if (msg.reactions.cache.get('🔑') == undefined && msg.reactions.cache.get('📧') == undefined && msg.reactions.cache.get('👀') == undefined && msg.reactions.cache.get('🗑️') == undefined && msg.reactions.cache.get('❌') == undefined && msg.reactions.cache.get('🔨') == undefined && msg.reactions.cache.get('📫') == undefined) await msg.react('🔑');
  				// push it to open modmails and open collector
  				openModmails.push(msg.id);
  				const modmailCollector = msg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0 });
				modmailCollector.on('collect', async (reaction, user) => {
					const reacts = ['📧','👀','🗑️','❌','🔨', '🔒'];
					const AuthorUserId = msg.embeds[0].description.split(' ')[0].replace(/<@/g, '').replace(/>/g, '');
					const AuthorMessage = msg.embeds[0].description.split(':')[1].replace(/"/g, '');
					if (user.bot) return;
					switch (reaction.emoji.name){
						case '🔑':
							// react to all and remove key
							await msg.reactions.cache.get('🔑').remove().catch(error => console.error('Failed to remove reactions: ', error));
							await reacts.forEach(async reaction => await msg.react(reaction));
							break;
						case '📧':
							// Allow to answer (awaitMessagese)
							await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
							const confirmMsg = await msg.channel.send(`user sent: \`${AuthorMessage}\`\nPlease input whatever you want to respond.`);
							var stage = 'inputMessage';
							confirmMsg.channel.awaitMessages((m) => { return m.author.id == user.id }, { max: 1, time: 60000, errors: ['time'] }).then(async response => {
								var msgtosend = response.values().next().value;
								// verify if good message
								const askConfirm = await confirmMsg.channel.send(`Do you want to send : \`${msgtosend.content}\`\n**Respond with *yes*, or *no* !**`);
								askConfirm.channel.awaitMessages((m2) => { return m2.author.id ==  msgtosend.author.id && (m2.content.toLowerCase() == 'yes' || m2.content.toLowerCase() == 'y' || m2.content.toLowerCase() == 'no' || m2.content.toLowerCase() == 'n') }, { max: 1, time: 60000, errors: ['time'] }).then(async resConfirm => {
									stage = 'confirmAnswer';
									// check yes or no
									var responseConfirmation = resConfirm.values().next().value;
									if (responseConfirmation.content.toLowerCase() == 'yes' || responseConfirmation.content.toLowerCase() == 'y'){
										// yes
										await cli.users.cache.get(AuthorUserId).send(msgtosend.content).catch(err => console.error(err));
										msgtosend.delete();
										confirmMsg.delete();
										askConfirm.delete();
										responseConfirmation.delete();
										stage = 'ended';
										await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
										let newEmbed = msg.embeds[0];
										newEmbed.addField(`Response by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(msgtosend.author.id).displayName}:`, `${msgtosend.content}`);
										msg.edit({ embed: newEmbed });
										await msg.react('📫');
										return;
									} else if (responseConfirmation.content.toLowerCase() == 'no' || responseConfirmation.content.toLowerCase() == 'n'){
										// add all reactions again and delete all
										await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
										await msg.react('🔑');
										await msgtosend.delete();
										await confirmMsg.delete();
										await askConfirm.delete();
										await responseConfirmation.delete();
										stage = 'ended';
										return;
									}
								}).catch(async err => {
									return true;
								})
							}).catch(async err => {
								if (stage == 'ended'){
									return true;
								} else {
									await confirmMsg.channel.send(`No input was precised within the 60 seconds, aborted.`);
									await confirmMsg.delete();
									stage = 'ended';
								}
							})
							break;
						case '👀':
							// Send the user that the message has been seen
							await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
							await msg.react('👀');
							cli.users.cache.get(AuthorUserId).send(`Your message has been received and read by the staff.`).catch(err => console.error(err));
							break;
						case '🗑️':
							// Ignore the message
							await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
							await msg.react('🗑️');
							break;
						case '❌':
							// Delete the msg
							await msg.delete();
							break;
						case '🔨':
							await msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
							await msg.react('🔨');
							cli.users.cache.get(AuthorUserId).send(`You have been blacklisted from sending modmails by the Fungal Cavern staff.`).catch(err => console.error(err));
							insertmodmailblacklisted_user(AuthorUserId, null);
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

module.exports = modmailReactions;