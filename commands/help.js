async function help(cli, cfg, data){
	const embed = {
		"title": "***All the commands you can use on your server!***",
		"color": 2900657,
		"footer": {
			"text": "Capitalization does not matter when using the commands."
		}, "fields":
		[
		{
			"name": "**__Raiding:__**", "value": "```fix\nafk; hc; location; clear; yoink; lock; unlock; poll```"
		}, {
			"name": "**__Moderation:__**", "value": "```fix\nfind; nonames; purge; feedbackblacklist; fixname; ban; kick; mute; pmute; unmute; suspend; psuspend; unsuspend; vetmanualverify; manualverify; vetunverify; unverify; addalt```"
		}, {
			"name": "**__Server Management:__**", "value": "```fix\nping; dbamount; restart```"
		}, {
			"name": "**__Raiders Commands:__**", "value": "```fix\njoin; avatar```\nTo learn more about a command, use the command -cmds <command name>"
		} ]
	};

// help command
	if (!data.content.toLowerCase().split(' ')[1]){
		await data.channel.send({ embed });
	} else {
		switch(data.content.toLowerCase().split(' ')[1]){
			case 'restart':
				return data.channel.send(`**\*restart (none)** : *Restarts the bot.*`);
				break;
			case 'purge':
				return data.channel.send(`**\*purge (none) [amount]** : *Deletes a certain amount of messages in the channel.*`);
				break;
			case 'fixname': case 'fn':
				return data.channel.send(`**\*fixname (\*fn) [IGN/@user] [new name]** : *Changes the name of someone and updates it into the database.*`);
				break;
			case 'mute':
				return data.channel.send(`**\*mute (none) [IGN/@user] [time amount] [time unit (m, d, w)] [reason]** : *Mutes a single user for a specified time.*`);
				break;
			case 'pmute':
				return data.channel.send(`**\*pmute (none) [IGN/@user] [reason]** : *Mutes permanently a single user.*`);
				break;
			case 'unmute':
				return data.channel.send(`**\*unmute (none) [IGN/@user] [reason]** : *Unmutes a single user.*`);
				break;
			case 'psuspend':
				return data.channel.send(`**\*psuspend (none) [IGN/@user] [reason]** : *Suspends permanently a single user.*`);
				break;
			case 'manualverify': case 'mv':
				return data.channel.send(`**\*manualverify (\*mv) [@user/id] [ign] (proofs)** : *Manually verifies a raider that can't use the bots verification.*`);
				break;
			case 'vetmanualverify': case 'vmv':
				return data.channel.send(`**\*vetmanualverify (\*vmv) [@user/id] [ign] (proofs)** : *Manually verifies a raider for veteran role.*`);
				break;
			case 'unverify': case 'umv':
				return data.channel.send(`**\*unverify (\*umv) [IGN/@user] (proofs)** : *Unverifies a raider from the server.*`);
				break;
			case 'vetunverify': case 'vumv':
				return data.channel.send(`**\*vetunverify (\*vumv) [IGN/@user] (proofs)** : *Unverifies a raider from veteran.*`);
				break;
			case 'feedbackblacklist': case 'fbbl':
				return data.channel.send(`**\*feedbackblacklist (-fbbl) [add/remove/list] [id]** : *Blacklists someone from modmailing.*`);
				break;
			case 'suspend':
				return data.channel.send(`**\*suspend (none) [IGN/@user] [time amount] [time unit (m, d, w)] [reason]** : *Suspends a single user for a specified time.*`);
				break;
			case 'unsuspend':
				return data.channel.send(`**\*unsuspend (none) [IGN/@user] [time reason]** : *Unsuspends a single user.*`);
				break;
			case 'headcount': case 'hc':
				return data.channel.send(`**\*headcount (\*hc)** : *Puts up a headcount in the raid status announcement.*`);
				break;
			case 'find':
				return data.channel.send(`**\*find [ign/id (one or multiple)]** : *Finds one or multiple raiders to know basic informations.*`);
				break;
			case 'cmds': case 'help': case 'commands':
				return data.channel.send(`**\*commands (\*help, \*cmds) (command name for help)** : *Outputs this or command description, does not work in general, loots-n-oofs or raid-chat.*`);
				break;
			case 'addalt':
				return data.channel.send(`**\*addalt (none) [IGN/@user] [ign]** : *Adds an alt account for a specific user.*`);
				break;
			case 'clear': case 'clean':
				return data.channel.send(`**\*clear (\*clean)** : *Clears the current channel of its raiders.*`);
				break;
			case 'lock':
				return data.channel.send(`**\*lock (none) [# (1-3)]** : *Locks a specific channel for raiders to enter from.*`);
				break;
			case 'unlock':
				return data.channel.send(`**\*unlock (none) [# (1-3)]** : *Unlocks a specific channel for raiders to enter from.*`);
				break;
			case 'avatar':
				return data.channel.send(`**\*avatar (none) (@user/id)** : *Shows a link for someone's avatar or yours.*`);
				break;
			case 'afk':
				return data.channel.send(`**\*afk (none) [location]** : *Creates an afk check in the raid status announcement.*`);
				break;
			case 'nonames':
				return data.channel.send(`**\*nonames (none)** : *Shows list of users verified without a nickname.*`);
				break;
			case 'location': case 'loc':
				return data.channel.send(`**\*location [new location]** : *Sets a new location for the authors afk check.*`);
				break;
			case 'ban':
				return data.channel.send(`**\*ban [IGN/@user] (reason)** : *Bans an user from the server and dms him the reason.*`);
				break;
			case 'kick':
				return data.channel.send(`**\*kick [IGN/@user] (reason)** : *Kicks an user from the server and dms him the reason.*`);
				break;
			case 'poll':
				return data.channel.send(`**\*poll (none) "title" "one" "two" "three"..** : *Poll making.*`);
				break;
			case 'yoink':
				return data.channel.send(`**\*yoink (none) [channel's full name] (STAR)** : *Grabs all the raiders from the specified channel to yours, everyone if STAR is added.*`);
				break;
			case 'expelled':
				return data.channel.send(`**\*expelled (none)** [add, remove, list] (one or multiple igns) : *Expelled list, add or remove one or multiple users.*`);
				break;
			default:
				return data.channel.send(`Unknown command sir, use *cmds to get a list of them.`);
				break;
		}
	}
}

module.exports = help;