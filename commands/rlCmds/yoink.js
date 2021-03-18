const powerCalculation = require('../commands.js').powerCalculation;

async function grab(cli, cfg, data){
	const args = data.content.toLowerCase().split(' ');

	if (data.content.charAt(data.content.length - 1) == '*'){
		if (args[1] == undefined || data.guild.channels.cache.find(r => r.name == data.content.substr(7).slice(0, -2)) == undefined) return data.channel.send(`No channel was found with the name ${data.content.substr(7).slice(0, -2)}`);
		if (data.member.voice.channelID == undefined) return data.channel.send(`You cannot execute this command because you are in no voice channel.`);
		const vcRaiders = [];

		const grabMsg = await data.channel.send(`Force yoinking ${data.guild.channels.cache.find(r => r.name == data.content.substr(7).slice(0, -2)).name}`);
		await data.guild.channels.cache.find(r => r.name == data.content.substr(7).slice(0, -2)).members.forEach(async function(raiders){ 
			vcRaiders.push(raiders);
		});

		for (let i = 0; i < vcRaiders.length; i++){
			await vcRaiders[i].voice.setChannel(data.member.voice.channelID).catch(err => console.error(err));
			if (i == vcRaiders.length-1){
				await data.channel.send(`Finished force yoinking ${data.guild.channels.cache.find(r => r.name == data.content.substr(7).slice(0, -2)).name}!`);
				await grabMsg.delete();
			}
		}
	} else {
		if (args[1] == undefined || data.guild.channels.cache.find(r => r.name == data.content.substr(7)) == undefined) return data.channel.send(`No channel was found with the name ${data.content.substr(7)}`);
		if (data.member.voice.channelID == undefined) return data.channel.send(`You cannot execute this command because you are in no voice channel.`);
		const vcRaiders = [];

		const grabMsg = await data.channel.send(`Yoinking ${data.guild.channels.cache.find(r => r.name == data.content.substr(7)).name}`);
		await data.guild.channels.cache.find(r => r.name == data.content.substr(7)).members.forEach(async function(raiders){ 
			vcRaiders.push(raiders);
		});

		for (let i = 0; i < vcRaiders.length; i++){
			if (await powerCalculation(cli, cfg, vcRaiders[i].user.id) < 2) await vcRaiders[i].voice.setChannel(data.member.voice.channelID).catch(err => console.error(err));
			if (i == vcRaiders.length-1){
				await data.channel.send(`Finished yoinking ${data.guild.channels.cache.find(r => r.name == data.content.substr(7)).name}!`);
				await grabMsg.delete();
			}
		}
	}
}

module.exports = grab;