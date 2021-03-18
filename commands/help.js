async function help(cli, cfg, data){
	const embed = {
		"title": "***All the commands you can use on your server!***",
		"color": 2900657,
		"footer": {
			"text": "Capitalization does not matter when using the commands."
		}, "fields":
		[
		{
			"name": "**__Raiding:__**", "value": "```fix\nafk; parsemembers; hc; log; pop; location; clear; yoink; lock; unlock; poll```"
		}, {
			"name": "**__Moderation:__**", "value": "```fix\nfind; commend; expelled; characterlist; nonames; purge; changelogs; feedbackblacklist; history; warn; fixname; ban; kick; mute; pmute; unmute; suspend; psuspend; unsuspend; vetmanualverify; manualverify; unverify; addalt```"
		}, {
			"name": "**__Server Management:__**", "value": "```fix\nping; --resetweek--; restart```"
		}, {
			"name": "**__Raiders Commands:__**", "value": "```fix\njoin; avatar; roat; koat; loat; stats```\nTo learn more about a command, use the command -cmds <command name>"
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
			case 'commend':
				return data.channel.send(`**\*commend (none) [Rusher] [IGN/@user]** : *Commends user for rusher role or in the future others.*`);
				break;
			case 'purge':
				return data.channel.send(`**\*purge (none) [amount]** : *Deletes a certain amount of messages in the channel.*`);
				break;
			case 'changelogs': case 'cls':
				return data.channel.send(`**\*changelogs (\*cls) [IGN/@user] [add/remove] [s/f/a/p] (amount)** : *Changes the logs of an users, successes, fails, assists or pops.*`);
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
			case 'log':
				return data.channel.send(`**\*log (none) [s/success/f/fail] (amount) (@assisted1 @assisted2 @assisted3)** : *Logs a run you did as failed or successful in your stats.*`);
				break;
			case 'pop':
				return data.channel.send(`**\*pop (none) [IGN/@user] [fc/e] (amount)** : *Logs a key pop in users stats.*`);
				break;
			case 'warn':
				return data.channel.send(`**\*warn (none) [IGN/@user] [clear OR reason]** : *Warns an user or clears all of his warns.*`);
				break;
			case 'warns':
				return data.channel.send(`**\*warns (none) [IGN/@user]** : *Shows every warn of a certain user.*`);
				break;
			case 'find':
				return data.channel.send(`**\*find [ign/id (one or multiple)]** : *Finds one or multiple raiders to know basic informations.*`);
				break;
			case 'cmds': case 'help': case 'commands':
				return data.channel.send(`**\*commands (\*help, \*cmds) (command name for help)** : *Outputs this or command description, does not work in general, loots-n-oofs or raid-chat.*`);
				break;
			case 'userstats': case 'us':
				return data.channel.send(`**\*userstats (\*us) [@user/id]** : *Shows users stats for the server, does not work in general, loots-n-oofs or raid-chat.*`);
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
			case 'roat':
				return data.channel.send(`**\*roat (none)** : *Shows the leaderboard: raiders of all time.*`);
				break;
			case 'loat':
				return data.channel.send(`**\*loat (none)** : *Shows the leaderboard: leaders of all time.*`);
				break;
			case 'koat':
				return data.channel.send(`**\*koat (none)** : *Shows the leaderboard: keypoppers of all time.*`);
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
			case 'parsemembers': case 'pm':
				return data.channel.send(`**\*parsemembers (\*pm) [image]** : *Lists all users crashing in a run.*`);
				break;
			case 'history':
				return data.channel.send(`**\*history (\*h) [IGN/@user]** : *Advanced fetching users past actions.*`);
				break;
			case 'poll':
				return data.channel.send(`**\*poll (none) "title" "one" "two" "three"..** : *Poll making.*`);
				break;
			case 'resetweek':
				return data.channel.send(`**\*resetweek (none)** : *Resets this current week's parses and activity.*`);
				break;
			case 'yoink':
				return data.channel.send(`**\*yoink (none) [channel's full name] (STAR)** : *Grabs all the raiders from the specified channel to yours, everyone if STAR is added.*`);
				break;
			case 'expelled':
				return data.channel.send(`**\*expelled (none)** [add, remove, list] (one or multiple igns) : *Expelled list, add or remove one or multiple users.*`);
				break;
			default:
				return data.channel.send(`unknown command sir`);
				break;
		}
	}
}

module.exports = help;