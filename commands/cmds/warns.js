const Discord = require('discord.js');
const { showWarns, findbyIGN } = require('../../db.js');

async function warns(cli, cfg, data){
	// check user
	const args = data.content.split(' ');
	// arg1 verification
	let user = data.mentions.users.first();
	if (user) user = user.id;
	if (!user) user = args[1];
	if (!user) return data.channel.send(`Please input an ign, mention or specify an id.`);

	// find by ign
	await findbyIGN(user, async function(result){
		if (result == undefined){
			return data.channel.send(`Please input an ign, mention or specify an id.`);
		} else {
			user = result.id;

			await showWarns(user, async function(result){
				if (result == undefined){
					return data.channel.send(`User has no warns registered!`);
				} else {
					const embed = new Discord.MessageEmbed({
						"title": `Warns found for user ${data.guild.members.cache.get(user).displayName}`,
						"color": 2900657,
						"timestamp": new Date(data.createdTimestamp).toISOString()
					});
					
					await result.forEach(async warn => {
						await embed.addField(`Mods name: ${data.guild.members.cache.get(warn.modid).displayName}`, `Reason: ${warn.reason}`);
					})

					return data.channel.send({ embed });
				}
			})
		}
	})
}

module.exports = warns;