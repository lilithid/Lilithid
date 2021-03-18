const { getCharacters, getCharacterList } = require('../realmeye.js');
const { findbyIGN } = require('../db.js');

const inVetPending = [];

async function veriEmbed(description){
	return {
		"title": `Your veteran verification status!`,
		"description": `\n${description}`,
		"color": 2900657
	}
}


async function verification(cli, cfg, user){
	if (inVetPending.includes(user.id)) return;
	let userIGN = cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).displayName.replace(/[^\w|\s]/gi, '').trim();
	if (userIGN.includes('|')) userIGN = userIGN.split('|')[0].trim();
	
	await findbyIGN(userIGN, async (userResult) => {

		let maxedChars = 0;
		let meleeCount = 0;

		let realmeyeReqs = await getCharacters(userIGN);
		realmeyeReqs.forEach((gameClass) => {
			if (gameClass.stats_maxed == 8) maxedChars += 1;
			if (gameClass.class == 'Warrior' || gameClass.class == 'Knight' || gameClass.class == 'Paladin') meleeCount += 1;
		})

		let characterList = await getCharacterList(userIGN);

		let errors = [];

		if (meleeCount < 1) errors.push(`- Doesn't have enough melees (${meleeCount}/1)\n`);
		if (maxedChars < 2) errors.push(`- Doesn't have enough 8/8's (${maxedChars}/2)\n`);
		if (userResult.raiderRuns < 50) errors.push(`- Doesn't have enough runs (${userResult.raiderRuns}/50)\n`);

		if (errors.length > 0) {
				let newEmbed = await veriEmbed(`Sorry but you do not meet our veteran requirements, you are now under manual review.`);
				// push to veripendings
				await cli.channels.cache.get(cfg.fungalcavern.vetveripending).send({embed: {
					"title": `${user.username}#${user.discriminator} tried to veteran verify as: ${userIGN}`,
					"timestamp": new Date().toISOString(),
					"color": 16312092,
					"description": `${user}'s Application: [Player Link](https://www.realmeye.com/player/${userIGN})\n\n**Character list:**\n${characterList.join('\n')}`,
					"fields": [
						{
							"name": `Runs logged on bot:`,
							"value": `Fungal: ${userResult.raiderRuns}`,
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
				}}).then((vetVeriPending) => { vetVeriPending.react('🔑') });
				await require('./vetveripending.js')(cli, cfg);
				inVetPending.push(user.id);
				return user.send({ embed: newEmbed });
		} else {
			// Verify user
			let verifiedEmbed = await veriEmbed(`You are now succesfuly a veteran raider!\nPlease take time to read our veteran <#656926813771137064> before going in any run.`);
			await user.send({ embed: verifiedEmbed });
			await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(user.id).roles.add(cfg.fungalcavern.vetRaiderRole).catch(console.error);
		}
	})

}

module.exports = verification;