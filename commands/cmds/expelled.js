const { expelUser, unexpelUser, isExpelled, getExpelledList } = require('../../db.js');

async function expelled(cli, cfg, data){
	const args = data.content.split(' ');
	if (!args[1]) return data.channel.send(`Unknown parameter, available: add, remove, list.`);

	switch (args[1].toLowerCase()){
		case 'add': case 'remove':
			if (!args[2]) return data.channel.send(`Please enter one or multiple username(s) to expel/unexpel`);
			await args.forEach(async raider => {
				if (raider == args[0] || raider == args[1]) return;
				await isExpelled(raider.toLowerCase(), async function(result){
					if (args[1].toLowerCase() == 'add' && !result){
						await expelUser(raider);
						return data.channel.send(`${raider} was succesfuly expelled!`);
					} else if (args[1].toLowerCase() == 'add' && result){
						return data.channel.send(`${raider} is already expelled!`);
					} else if (args[1].toLowerCase() == 'remove' && result){
						await unexpelUser(raider);
						return data.channel.send(`${raider} was succesfuly unexpelled!`);
					} else if (args[1].toLowerCase() == 'remove' && !result){
						return data.channel.send(`${raider} isn't expelled!`);
					}
				})
			});
			break;
		case 'list':
			await getExpelledList(expelledList => {
				const arr = `**Expelled users (${expelledList.length}):** ${expelledList.map(e => e.ign).join(', ')}`.match(/.{1,2000}/g);

				for (let chunk of arr) {
					data.channel.send({ embed: {
						"description": `${chunk}`,
						"color": '#db7209',
						"timestamp": new Date(data.createdTimestamp).toISOString()
						}
					});
				}
				return;
			})
			break;
	}
}

module.exports = expelled;