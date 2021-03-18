const { findbyID } = require('../../db.js');

function chunkSubstr(str, size) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks
}

async function weeklyparses(cli, cfg, data){
	const didntMetQuotaRL = [];
	const metQuotaRL = [];
	const alreadyInLeaderboard = [];

	cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.id == '635413949940236301').members.forEach(arl => {
		if (alreadyInLeaderboard.includes(arl.user.id)) return;
		alreadyInLeaderboard.push(arl.user.id);
		if (arl.user.bot) return;
		if (arl.roles.cache.find(r => (r.name === "Admin"))){
			return;
		} else {
			findbyID(arl.user.id, function(result){
				if (result.currentWeekRuns < 3){
					didntMetQuotaRL.push([arl, result.currentWeekRuns]);
				} else {
					metQuotaRL.push([arl, result.currentWeekRuns]);
				}
			})
		}
	});

	cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.id == '635413949759619082').members.forEach(rl => {
		if (alreadyInLeaderboard.includes(rl.user.id)) return;
		alreadyInLeaderboard.push(rl.user.id);
		if (rl.user.bot) return;
		if (rl.roles.cache.find(r => (r.name === "Admin"))){
			return;
		} else {
			findbyID(rl.user.id, function(result){
				if (result.currentWeekRuns < 3){
					didntMetQuotaRL.push([rl, result.currentWeekRuns]);
				} else {
					metQuotaRL.push([rl, result.currentWeekRuns]);
				}
			})
		}
	});

	cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.id == '656917045631254550').members.forEach(vrl => {
		if (alreadyInLeaderboard.includes(vrl.user.id)) return;
		alreadyInLeaderboard.push(vrl.user.id);
		if (vrl.user.bot) return;
		if (vrl.roles.cache.find(r => (r.name === "Admin"))){
			return;
		} else {
			findbyID(vrl.user.id, function(result){
				if (result.currentWeekRuns < 3){
					didntMetQuotaRL.push([vrl, result.currentWeekRuns]);
				} else {
					metQuotaRL.push([vrl, result.currentWeekRuns]);
				}
			})
		}
	});

	cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.id == '635413947314601994').members.forEach(hrl => {
		if (alreadyInLeaderboard.includes(hrl.user.id)) return;
		alreadyInLeaderboard.push(hrl.user.id);
		if (hrl.user.bot) return;
		if (hrl.roles.cache.find(r => (r.name === "Admin"))){
			return;
		} else {
			findbyID(hrl.user.id, function(result){
				if (result.currentWeekRuns < 3){
					didntMetQuotaRL.push([hrl, result.currentWeekRuns]);
				} else {
					metQuotaRL.push([hrl, result.currentWeekRuns]);
				}
			})
		}
	});

	cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.id == '635413943791255615').members.forEach(mod => {
		if (alreadyInLeaderboard.includes(mod.user.id)) return;
		alreadyInLeaderboard.push(mod.user.id);
		if (mod.user.bot) return;
		if (mod.roles.cache.find(r => (r.name === "Admin"))){
			return;
		} else {
			findbyID(mod.user.id, function(result){
				if (result.currentWeekRuns < 3){
					didntMetQuotaRL.push([mod, result.currentWeekRuns]);
				} else {
					metQuotaRL.push([mod, result.currentWeekRuns]);
				}
			})
		}
	});

	var embed = setTimeout(function(){

		metQuotaRL.sort(function(a, b) {
	    	return b[1] - a[1];
		});
		didntMetQuotaRL.sort(function(a, b) {
	    	return b[1] - a[1];
		});

		var msg = `# Met quota:\n`;

		metQuotaRL.forEach(function(rl){
			msg += `+ (${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(rl[0].user.id).roles.highest.name}) ${rl[0].displayName.replace(/[^\w|\s]/gi, '')} - ${rl[1]} successes\n`;
		});

		msg += `\n`;

		msg += `\n# Didn't meet quota:\n- `;

		didntMetQuotaRL.forEach(function(rl){
			if (rl[0].displayName.includes('|')) msg += `${rl[0].displayName.replace(/[^\w|\s]/gi, '').split('|')[0].trim()}, `;
			if (!rl[0].displayName.includes('|')) msg += `${rl[0].displayName.replace(/[^\w|\s]/gi, '')}, `;
		});

		let description = `${msg}`;
		let splitDescription = chunkSubstr(description, 1950);

		for (let chunk of splitDescription) {
			var embed = {
				"title": `**Current week\'s runs**`,
				"description": `**If you do not show up, it means you have 0 runs.**\n\`\`\`diff\n${chunk}\`\`\``,
				"color": 5902238,
				timestamp: new Date(data.createdTimestamp).toISOString(),
			};

			data.channel.send({ embed: embed });
		}
	}, 5000);
}

module.exports = weeklyparses;