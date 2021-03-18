async function avatar(cli, cfg, data){
	let user = data.mentions.users.first();
	if(!user) user = data.author;
	
	const embed = {
  		"color": 16771920,
  		"description": `[${user.username}'s avatar](${user.displayAvatarURL()}?size=2048)`,
  		"image": {
    		"url": `${user.displayAvatarURL()}?size=2048`
  		}
	};

	data.channel.send({ embed });
}

module.exports = avatar;