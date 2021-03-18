const { getUser, getDescription, notfoundCheck } = require('../realmeye.js');
const { doingVerifications } = require('../main.js');
const { isExpelled, expelUser, unexpelUser, insert_user, isInDB } = require('../db.js');

const antiSpamEmote = new Set();

async function veriLog(cli, cfg, user, state, additionalData){
	let verilogsChannel = cli.channels.cache.get(cfg.fungalcavern.verilogs);
	switch(state){
		case 'started':
			await verilogsChannel.send({ embed: { "description": `\n${user} started the verification process.`, "color": 8311585 } });
			break;
		case 'ign':
			await verilogsChannel.send({ embed: { "description": `\n${user} chose to verify as ${additionalData}.`, "color": 16312092 } });
			break;
		case 'wrongign':
			await verilogsChannel.send({ embed: { "description": `\n${user} tried to verify with an incorrect username (${additionalData}), verification was cancelled.`, "color": 13632027 } });
			break;
		case 'expelled':
			await verilogsChannel.send({ embed: { "description": `\n${user} tried to verify with ${additionalData} but is expelled.`, "color": 13632027 } });
			break;
		case 'verifiedname':
			await verilogsChannel.send({ embed: { "description": `\n${user} tried to verify with ${additionalData} but this name is already verified.`, "color": 13632027 } });
			break;
		case 'incorrectsettings':
			await verilogsChannel.send({ embed: { "description": `\n${user} has some settings privated, verification was cancelled.`, "color": 13632027 } });
			break;
		case 'code':
			await verilogsChannel.send({ embed: { "description": `\n${user}, trying to find a code in his profile.`, "color": 16312092 } });
			break;
		case 'codenotfound':
			await verilogsChannel.send({ embed: { "description": `\n${user}, couldn't find any code in his profile within 30 seconds.`, "color": 13632027 } });
			break;
		case 'dontmeetreqs':
			await verilogsChannel.send({ embed: { "description": `\n${user} doesn't meet our veri requirements.`, "color": 13632027 } });
			break;
		case 'verified':
			await verilogsChannel.send({ embed: { "description": `\n${user} was succesfuly verified as ${additionalData}.`, "color": 8311585 } });
			break;
	}
}

async function veriEmbed(description){
	return {
		"title": `Your verification status!`,
		"description": `\n${description}`,
		"color": 2900657
	}
}

async function generateCode(){
	return `FC${Math.floor(Math.random() * 9999) + 1000}`;
}

async function verification(cli, cfg, data, dmVeriMsg, veriMsg){
	await veriLog(cli, cfg, data.author, 'started', undefined);
	// check ign
	let userIGN = data.content.split(' ')[1];

	await veriLog(cli, cfg, data.author, 'ign', userIGN);
	let ignCheck = await veriEmbed(`Quickly checking your username..`);
	await dmVeriMsg.edit({ embed: ignCheck });

	let index = doingVerifications.indexOf(data.author.id);
	if (index > -1) doingVerifications.splice(index, 1);

	// Check if in db
	await isInDB(userIGN, async (isInDbb) => {
		if (isInDbb){
			await veriLog(cli, cfg, data.author, 'verifiedname', userIGN);
			let newEmbed = await veriEmbed(`Sorry but an user is already verified as this name, verification was cancelled.`);
			await veriMsg.reactions.cache.get('✅').users.remove(data.author).catch(error => console.error(err));
			return dmVeriMsg.edit({ embed: newEmbed });
		} else {

			let realmeye = await getDescription(userIGN);

			if (realmeye == `notfound`){
				await veriLog(cli, cfg, data.author, 'wrongign', userIGN);
				let newEmbed = await veriEmbed(`Sorry but your in game name looks wrong\nPlease re-react in <#${cfg.fungalcavern.verichannel}> and verify your ign.`);
				await veriMsg.reactions.cache.get('✅').users.remove(data.author).catch(error => console.error(err));
				return dmVeriMsg.edit({ embed: newEmbed });
			}

			let settingsCheck = await veriEmbed(`Checking your account settings..`);
			await dmVeriMsg.edit({ embed: settingsCheck });

			// Check expelled
			await isExpelled(userIGN, async (isExpelledddd) => {
				if (isExpelledddd){
					await veriLog(cli, cfg, data.author, 'expelled', userIGN);
					let newEmbed = await veriEmbed(`You are blacklisted from verification.`);
					await veriMsg.reactions.cache.get('✅').users.remove(data.author).catch(error => console.error(err));
					return dmVeriMsg.edit({ embed: newEmbed });
				} else {
					let hiddenC = await notfoundCheck(userIGN);

					if (hiddenC == `wrong`){
						await veriLog(cli, cfg, data.author, 'incorrectsettings', undefined);
						let newEmbed = await veriEmbed(`Sorry but your something in your profile looks wrong\nPlease unprivate everything and set your last known location to hidden\nThen re-react in <#${cfg.fungalcavern.verichannel}>.`);
						await veriMsg.reactions.cache.get('✅').users.remove(data.author).catch(error => console.error(err));
						return dmVeriMsg.edit({ embed: newEmbed });
					}

					let codeVeri = await generateCode();
					
					let codeEmbed = await veriEmbed(`Settings are looking good!\nPlease enter in **any line of your realmeye's description** this code: \`${codeVeri}\`\nAfter you entered the code in any line, react below.`);
					await dmVeriMsg.edit({ embed: codeEmbed });
					await dmVeriMsg.react('✅');

					const dmVeriCollector = dmVeriMsg.createReactionCollector((reaction, user) => {return !user.bot}, { time: 0, limit: 2 });
					dmVeriCollector.on('collect', async (reaction, user) => {
						if (reaction.emoji.name == '✅'){
							if (antiSpamEmote.has(user.id)) return;
							antiSpamEmote.add(user.id);
							setTimeout(() => {
								antiSpamEmote.delete(user.id);
							}, 40000);
							await veriLog(cli, cfg, data.author, 'code', undefined);
							let codeWaiting = await veriEmbed(`Checking your description..\nIt can take up to 30s for realmeye to update.`);
							await dmVeriMsg.edit({ embed: codeWaiting });

							var abandonned = false;
							var foundCode = false;

							setTimeout(() => {
								abandonned = true;
							}, 40000)

							while(!abandonned && !foundCode){
								let realmeye = await getDescription(userIGN);
								if (realmeye.some((line) => line.includes(codeVeri))){
									foundCode = true;
								}
							}

							if (!foundCode){
								await veriLog(cli, cfg, data.author, 'codenotfound', undefined);
								let newEmbed = await veriEmbed(`We were unable to find the code in your description within 30 seconds.\nPlease make sure \`${codeVeri}\` is in your description then unreact and re-react below.`);
								return dmVeriMsg.edit({ embed: newEmbed });
							} else {
								// check reqs
								let checkingReqs = await veriEmbed(`Code was found in your description\nNow looking for requirements..`);
								await dmVeriMsg.edit({ embed: checkingReqs });

								let errors = [];
								let realmeyeReqs = await getUser(userIGN);
								if (isNaN(realmeyeReqs.fame) || realmeyeReqs.fame < 500) errors.push(`- Fame (${realmeyeReqs.fame}/500)\n`);
								if (realmeyeReqs.rank < 20) errors.push(`- Rank (${realmeyeReqs.rank}/20)\n`);
								
								if (errors.length > 0){
									await veriLog(cli, cfg, data.author, 'dontmeetreqs', userIGN);
									let newEmbed = await veriEmbed(`Sorry but you do not meet our requirements, you are now under manual review.\nDo not ask for help or dm any staff member before atleast 24 hours.`);
									// push to veripendings

									if (!realmeyeReqs.rank) realmeyeReqs.rank = 'None';
									if (!realmeyeReqs.guild || realmeyeReqs.guild != undefined) realmeyeReqs.guild = `[${realmeyeReqs.guild}](https://www.realmeye.com/guild/${realmeyeReqs.guild.replace(/ /g, '%20')})`
									if (!realmeyeReqs.guild) realmeyeReqs.guild = 'None';
									if (!realmeyeReqs.guild_rank) realmeyeReqs.guild_rank = 'None';
									if (!realmeyeReqs.fame) realmeyeReqs.fame = 'None';
									if (!realmeyeReqs.created || realmeyeReqs.created.length < 1) realmeyeReqs.created = 'None';
									if (!realmeyeReqs.player_last_seen) realmeyeReqs.player_last_seen = 'None';
									if (!realmeyeReqs.chars) realmeyeReqs.chars = 'None';
									if (!realmeyeReqs.account_fame) realmeyeReqs.account_fame = 'None';
									//fix empty
									await cli.channels.cache.get(cfg.fungalcavern.veripending).send({embed: {
										"title": `${data.author.username}#${data.author.discriminator} tried to verify as: ${userIGN}`,
										"timestamp": new Date(data.createdTimestamp).toISOString(),
										"color": 16312092,
										"description": `${data.author}'s Application: [Player Link](https://www.realmeye.com/player/${userIGN})`,
										"fields": [
											{
												"name": `Player Rank:`,
												"value": `${realmeyeReqs.rank}⭐`,
												"inline": true
											},
											{
												"name": `Guild:`,
												"value": `[${realmeyeReqs.guild}](https://www.realmeye.com/guild/${realmeyeReqs.guild.replace(/ /g, '%20')})`,
												"inline": true
											},
											{
												"name": `Guild Rank:`,
												"value": `${realmeyeReqs.guild_rank}`,
												"inline": true
											},
											{
												"name": `Player Alive Fame:`,
												"value": `${realmeyeReqs.fame}`,
												"inline": true
											},
											{
												"name": `Account Created:`,
												"value": `${realmeyeReqs.created}`,
												"inline": true
											},
											{
												"name": `Player Last Seen:`,
												"value": `${realmeyeReqs.player_last_seen}`,
												"inline": true
											},
											{
												"name": `Character Count:`,
												"value": `${realmeyeReqs.chars}`,
												"inline": true
											},
											{
												"name": `Account Fame:`,
												"value": `${realmeyeReqs.account_fame}`,
												"inline": true
											},
											{
												"name": `Discord account created:`,
												"value": data.author.createdAt,
												"inline": true
											},
											{
												"name": `Problems:`,
												"value": `${errors.join('')}`
											},
										],
										"footer": {
											"text": `Pending Verification`
										}
									}}).then((veriPendingMsg) => { veriPendingMsg.react('🔑') });
									await expelUser(userIGN);
									await require('./veripending.js')(cli, cfg);
									return dmVeriMsg.edit({ embed: newEmbed });
								} else {
									// Verify user
									await veriLog(cli, cfg, data.author, 'verified', userIGN);
									let verifiedEmbed = await veriEmbed(`You are now succesfuly verified!\nPlease take time to read <#635419028760035329> and <#635526803200540692> before going in any run.`);
									await dmVeriMsg.edit({ embed: verifiedEmbed });
									await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).roles.add(cfg.fungalcavern.raiderRole).catch(console.error);
									await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).setNickname(userIGN, "Reason: Verification process.").catch(err => console.error(err));
									await insert_user(data.author.id, userIGN);
									await unexpelUser(userIGN);
								}
							}
						}

					})
				}
			})
		}
	})

}

module.exports = verification;