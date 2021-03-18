async function poll(cli, cfg, data){
	// *poll "title" "one" "two"...
	if (data.content.split(' ')[1].toLowerCase() == 'region'){
		const embed = {
			"description": `📊 **Region Poll** 📊\n\n1️⃣ EU\n2️⃣ US`,
			"color": 5902238,
			"footer": {
				"text": `Started by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).displayName}`
			}
		};

		const embedMsgReacts = await data.channel.send({ embed });
		await embedMsgReacts.react(`1️⃣`);
		await embedMsgReacts.react(`2️⃣`);
		await data.delete();
		return;
	}

	if (!data.content.includes('"') && !data.content.includes('“')) return data.channel.send(`Please use the correct format: *poll "title" "one" "two"..`);
	const utfNumbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
	let args;

	if (data.content.includes('"')){
		args = data.content.split('"');
	} else if (data.content.includes('“')){
		args = data.content.split('“');
	}
	
	const optionsSize = ((args.length-2)/2);

	if (optionsSize > 11 || optionsSize < 2) return data.channel.send(`Number of options must be between 2 and 10!`);
	let title = args[1];
	const options = [];

	if (optionsSize > 1) options.push(`1️⃣ ${args[3]}`);
	if (optionsSize > 2) options.push(`2️⃣ ${args[5]}`);
	if (optionsSize > 3) options.push(`3️⃣ ${args[7]}`);
	if (optionsSize > 4) options.push(`4️⃣ ${args[9]}`);
	if (optionsSize > 5) options.push(`5️⃣ ${args[12]}`);
	if (optionsSize > 6) options.push(`6️⃣ ${args[14]}`);
	if (optionsSize > 7) options.push(`7️⃣ ${args[16]}`);
	if (optionsSize > 8) options.push(`8️⃣ ${args[18]}`);
	if (optionsSize > 9) options.push(`9️⃣ ${args[20]}`);
	if (optionsSize > 10) options.push(`🔟 ${args[22]}`);

	const embed = {
		"description": `📊 **${title}** 📊\n\n${options.join('\n')}`,
		"color": 5902238,
		"footer": {
			"text": `Started by ${cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).displayName}`
		}
	};

	const embedMsg = await data.channel.send({ embed });
	await data.delete();

	for(let i=0; i < optionsSize-1; i++){
		embedMsg.react(utfNumbers[i]);
	}

}

module.exports = poll;