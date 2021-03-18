const modmailReactions = require('./modmailreactions.js');

async function modmail(cli, cfg, data){
	const embed = {
		"description": `${data.author} sent the bot: \"${data.content}\"`,
		"color": 2900657,
		"timestamp": new Date(data.createdTimestamp).toISOString(),
		"footer": {
			"text": `User ID: ${data.author.id} Msg ID: ${data.id}`
		},
		"author": {
			"name": `${data.author.username}#${data.author.discriminator}`,
			"icon_url": data.author.avatarURL()
		}
	};

	if (data.attachments.size > 0){
		const msg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.modmail).send({ embed, files: [data.attachments.first().url] });
		await msg.react('🔑');
	} else {
		const msg = await cli.channels.cache.find(chan => chan.id == cfg.fungalcavern.modmail).send({ embed });
		await msg.react('🔑');
	}
	const warn = await data.author.send(`Message has now been sent to Fungal Cavern's modmails. If this was a mistake, then don't worry.`);
	await setTimeout(() => {warn.delete()}, 5000);
	await setTimeout(() => {data.react('📧')}, 6000);
	// open collector for it
	modmailReactions(cli, cfg);
}

module.exports = modmail;