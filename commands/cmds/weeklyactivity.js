const { getActivity } = require('../../db.js');

async function weeklyactivity(cli, cfg, data){
	const didntMetQuotaHelpers = [];
	const didntMetQuotaSecurities = [];
	const metQuotaHelpers = [];
	const metQuotaSecurities = [];

	cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name == 'Helper').members.forEach(helper => {
		if (helper.roles.cache.find(r => (r.name === "Security" || r.name === "Officer" || r.name === "Head Raid Leader" || r.name === "Moderator" || r.name === "Admin"))){
			return;
		} else {
			getActivity(helper.user.id, function(result){
				if (result.activityMeter < 35){
					didntMetQuotaHelpers.push([helper, result.activityMeter]);
				} else {
					metQuotaHelpers.push([helper, result.activityMeter]);
				}
			})
		}
	});

	cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.name == 'Security').members.forEach(security => {
		if (security.roles.cache.find(r => (r.name === "Officer" || r.name === "Head Raid Leader" || r.name === "Moderator" || r.name === "Admin"))){
			return;
		} else {
			getActivity(security.user.id, function(result){
				if (result.activityMeter < 60){
					didntMetQuotaSecurities.push([security, result.activityMeter]);
				} else {
					metQuotaSecurities.push([security, result.activityMeter]);
				}
			})
		}
	});

	var embed = setTimeout(function(){

		metQuotaSecurities.sort(function(a, b) {
	    	return b[1] - a[1];
		});
		metQuotaHelpers.sort(function(a, b) {
	    	return b[1] - a[1];
		});
		didntMetQuotaSecurities.sort(function(a, b) {
	    	return b[1] - a[1];
		});
		didntMetQuotaHelpers.sort(function(a, b) {
	    	return b[1] - a[1];
		});

		var msg = `# Met quota:\n`;

		metQuotaSecurities.forEach(function(security){
			msg += `+ (Security) - ${security[0].displayName} - ${security[1]}\n`;
		});

		msg += `\n`;

		metQuotaHelpers.forEach(function(helper){
			msg += `+ (Helper) - ${helper[0].displayName} - ${helper[1]}\n`;
		});

		msg += `\n# Didn't meet quota:\n`;

		didntMetQuotaSecurities.forEach(function(security){
			msg += `- (Security) - ${security[0].displayName} - ${security[1]}\n`;
		});

		msg += `\n`;

		didntMetQuotaHelpers.forEach(function(helper){
			msg += `- (Helper) - ${helper[0].displayName} - ${helper[1]}\n`;
		});

		var embed = {
			"description": `**Current week's activity**\n\n\`\`\`diff\n${msg}\`\`\``,
			"color": 5902238,
			timestamp: new Date(data.createdTimestamp).toISOString(),
		};

		data.channel.send({ embed: embed });
	}, 5500);
}

module.exports = weeklyactivity;