const { popKey, findbyIGN } = require('../../db.js');

async function popKeyS(cli, cfg, data){
	const args = data.content.toLowerCase().split(' ');

	// arg1 verification
	let user = data.mentions.users.first();
	if (user) user = user.id;
	if (!user) user = args[1];
	if (!user) return data.channel.send(`Please input an ign, mention or specify an id.`);
	if (args[2].toLowerCase() != 'fc' && args[2].toLowerCase() != 'e') return data.channel.send(`Please use either \`*pop name fc amount\`, or \`*pop name e amount\`.`);


	// find by ign
	await findbyIGN(user, async function(result){
		if (result == undefined){
			return data.channel.send(`Please input an ign, mention or specify an id.`);
		} else {
			user = result.id;

			if (args[2].toLowerCase() == 'fc'){
				// popped key
				if (args[3] && !isNaN(args[3])) {
					await popKey(user, args[3], 'fc', async function(result){
						await data.channel.send(`Succesfuly logged the key pops, they now have ${result.fungalPop}.`);
					})
				}
				if (args[3] == undefined) {
					await popKey(user, '1', 'fc', async function(result){
						await data.channel.send(`Succesfuly logged the key pop, they now have ${result.fungalPop}.`);
					});
				}
			} else if (args[2].toLowerCase() == 'e'){
				// popped key
				if (args[3] && !isNaN(args[3])) {
					await popKey(user, args[3], 'e', async function(result){
						await data.channel.send(`Succesfuly logged the key pops, they now have ${result.eventPops}.`);
					})
				}
				if (args[3] == undefined) {
					await popKey(user, '1', 'e', async function(result){
						await data.channel.send(`Succesfuly logged the key pop, they now have ${result.eventPops}.`);
					});
				}
			}
		}
	})
}

module.exports = popKeyS;