const Discord = require('discord.js');
const drip = new Discord.Client({ fetchAllMembers: true, sync: true, partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'] });
const cfg = require('./poggu');
drip.login(cfg.token);

const fs = require('fs');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const pfx = '*';
const cmdfs = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
drip.commands = new Discord.Collection();

for (const file of cmdfs){
	const cmd = require(`./cmds/${file}`);
	drip.commands.set(cmd.name, cmd);
}

drip.on('ready', async () => {
	console.log('up');
})

drip.on('message', async data => {
	if (data.author.bot) return;
	if (!data.content.startsWith(pfx)) return;

	const args = data.content.slice(pfx.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	if (!drip.commands.has(command)) return;

	try {
		drip.commands.get(command).execute(drip, data, args);
	} catch (error) {
		console.error(error);
		data.reply(`An internal error occurred while attempting to perform this command.`);
	}
})