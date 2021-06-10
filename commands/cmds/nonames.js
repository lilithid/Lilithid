const { findbyID, fixDbName, getUsersDb } = require('../../db.js');

async function nonames(cli, cfg, data, log){
	const noNameInDB = [];
	await getUsersDb(async function(dbResultt){
		await cli.guilds.cache.get(cfg.fungalcavern.id).roles.cache.find(r => r.id == '635413958144163850').members.forEach(async member => { // Verified Raider
			if (member.user.username == member.displayName){
				await noNameInDB.push(member.user);
				// no displayname
				let result = dbResultt.find(usr => usr.id == member.user.id);
				if (result == undefined){return;} else {
					if (result.ign.length > 0){
						let usernameIngame = result.ign;
						if (member.user.username == usernameIngame){
							usernameIngame = usernameIngame.toLowerCase();
						}
						if (member.user.username == usernameIngame){
							usernameIngame = (usernameIngame.charAt(0).toUpperCase()+usernameIngame.slice(1));
						}

						await cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(member.user.id).setNickname(usernameIngame, "Reason: Verification process.").catch(err => console.error(err));
					}
				}
			}
		})
	})
	if (log && noNameInDB.length > 0) return data.channel.send(`Fixed all people without a nickname, they were:\n${noNameInDB.join(', ')}`);
	if (log && noNameInDB.length == 0) return data.channel.send(`No one was found without a nickname.`);
}

module.exports = nonames;