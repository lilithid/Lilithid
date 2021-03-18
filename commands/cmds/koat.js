const dbkoat = require('../../db.js').koat;

async function koat(cli, cfg, data){
	await dbkoat(async function(result){
		// order 0 to 9
		var list = ``;
		var toGiveRole = [];
		var handled = 0;
		
		result = result.sort((a,b)=> (b.fungalPop - a.fungalPop));
		await result.forEach(async raider => {
			if (handled > 9) {

			} else {
			if (handled == 0) list += `${cli.emojis.cache.get('686223695827828774')} ${raider.ign}, ${raider.fungalPop}\n`;
			if (handled == 1) list += `2⃣ ${raider.ign}, ${raider.fungalPop}\n`;
			if (handled == 2) list += `3⃣ ${raider.ign}, ${raider.fungalPop}\n`;
			if (handled == 3) list += `4⃣ ${raider.ign}, ${raider.fungalPop}\n`;
			if (handled == 4) list += `5⃣ ${raider.ign}, ${raider.fungalPop}\n`;
			if (handled == 5) list += `6⃣ ${raider.ign}, ${raider.fungalPop}\n`;
			if (handled == 6) list += `7⃣ ${raider.ign}, ${raider.fungalPop}\n`;
			if (handled == 7) list += `8⃣ ${raider.ign}, ${raider.fungalPop}\n`;
			if (handled == 8) list += `9⃣ ${raider.ign}, ${raider.fungalPop}\n`;
			if (handled == 9) list += `🔟 ${raider.ign}, ${raider.fungalPop}`;
			// add peepoper role
			await handled++;
			}
		})

		const embed = {
			"title": `KOAT - Keypoppers of All Time`,
			"description": `${list}`,
			"color": 2900657,
			"timestamp": new Date(data.createdTimestamp).toISOString(),
			"footer": {
				"text": `Capitalization does not matter when using commands.`
			}
		};
		await data.channel.send({ embed });
	})
}

module.exports = koat;