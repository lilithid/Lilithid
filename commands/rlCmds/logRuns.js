const { logRun, findbyID }= require('../../db.js');

async function logRuns(cli, cfg, data){
	const args = data.content.toLowerCase().split(' ');

	if (args[1] == undefined) return data.channel.send(`Please specify how ended the run!\nie. success (s), fail (f)`);

	if (args[1] == 's' || args[1] == 'success'){
		// good run, check amount
		if (args[2] && isNaN(args[2]) && !args[2].startsWith('<@')) return data.channel.send(`Invalid amount of runs!`);

		if (args[2]) await logRun(data.author.id, args[2], 'success');
		if (args[2] == undefined) await logRun(data.author.id, '1', 'success');

		await findbyID(data.author.id, async function(result){
			await data.channel.send(`Succesfuly logged, you now have ${result.currentWeekRuns} successful runs this week.`);
		})

	} else if (args[1] == 'f' || args[1] == 'fail'){
		// failed run, check amount
		if (args[2] && isNaN(args[2])) return data.channel.send(`Invalid amount of runs!`);

		if (args[2]) await logRun(data.author.id, args[2], 'fail');
		if (args[2] == undefined) await logRun(data.author.id, '1', 'fail');

		await findbyID(data.author.id, async function(result){
			await data.channel.send(`Succesfuly logged, you now have ${result.failedRuns} total failed runs.`);
		})
	}

	// check for assists
	const assisteds = data.mentions.users;

	if (assisteds){
		await assisteds.forEach(async assistrl => {
			// give assists
			if (assistrl.id == data.author.id) return data.channel.send(`You cannot give yourself an assist!`);
			if (!isNaN(args[2])) await logRun(assistrl.id, args[2], 'assist');
			if (isNaN(args[2])) await logRun(assistrl.id, '1', 'assist');

			await findbyID(assistrl.id, async function(result){
				await data.channel.send(`${assistrl} was added an assist, they now have ${result.currentWeekAssists} logged this week.`);
			})
		})
	}
}

module.exports = logRuns;