const dbloat = require('../../db.js').loat;

async function roat(cli, cfg, data){
	await dbloat(async function(result){
		// order 0 to 9
		var list = ``;
		var handled = 0;
		
		result = result.sort((a,b)=> (b.successRuns - a.successRuns));
		await result.forEach(async raider => {
			if (handled > 9) return;
			if (handled == 0) list += `${cli.emojis.cache.get('686223695827828774')} ${raider.ign}, ${raider.successRuns}\n`;
			if (handled == 1) list += `2⃣ ${raider.ign}, ${raider.successRuns}\n`;
			if (handled == 2) list += `3⃣ ${raider.ign}, ${raider.successRuns}\n`;
			if (handled == 3) list += `4⃣ ${raider.ign}, ${raider.successRuns}\n`;
			if (handled == 4) list += `5⃣ ${raider.ign}, ${raider.successRuns}\n`;
			if (handled == 5) list += `6⃣ ${raider.ign}, ${raider.successRuns}\n`;
			if (handled == 6) list += `7⃣ ${raider.ign}, ${raider.successRuns}\n`;
			if (handled == 7) list += `8⃣ ${raider.ign}, ${raider.successRuns}\n`;
			if (handled == 8) list += `9⃣ ${raider.ign}, ${raider.successRuns}\n`;
			if (handled == 9) list += `🔟 ${raider.ign}, ${raider.successRuns}`;
			await handled++;
		})

		const embed = {
			"title": `LOAT - Leaders of All Time`,
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

module.exports = roat;