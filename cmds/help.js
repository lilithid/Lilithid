const Discord = require('discord.js');
const drip = new Discord.Client({ partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'] });
const fs = require('fs');

const cmdfs = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
drip.commands = new Discord.Collection();

for (const file of cmdfs){
	const cmd = require(`./cmds/${file}`);
	drip.commands.set(cmd.name, cmd);
}

module.exports = {
	name: 'help',
	description: 'lists available commands',
	optionals: '[name]',
	async execute(drip, data, args) {
		if (args.length < 1){
			let cmdlist = Array.from(drip.commands.keys());

			await data.channel.send({ embed: {
				"title": "commands available",
				"description": `${cmdlist.join(', ')}`,
				"color": 11589624
			}});
		} else {
			if (drip.commands.has(args[0].toLowerCase())){
				await data.channel.send({ embed: {
					"title": `${drip.commands.get(args[0].toLowerCase()).name}`,
					"description": `Description: ${drip.commands.get(args[0].toLowerCase()).description}\nUsage: -${drip.commands.get(args[0].toLowerCase()).name} ${drip.commands.get(args[0].toLowerCase()).optionals}`,
					"color": 16748766
				}});
			} else {
				await data.channel.send('unknown command name, please check -help');
			}
		}
	},
};