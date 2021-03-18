const { exportSuccesses, exportFails, exportAssists, exportKeys } = require('../../db.js');

async function exportLogs(cli, cfg, data){
	await data.channel.send(`Exporting the logs! **This might take some time and spam a lot**`);

	await exportSuccesses(function(rlsSuccessed){
		if (rlsSuccessed == undefined){} else {
		rlsSuccessed.forEach(async function(rlSucess){
			if (cli.users.cache.get(rlSucess.id) == undefined) return;
			await data.channel.send(`-changelogs ${rlSucess.id} add s ${rlSucess.successRuns}`);
		})
		}
	})

	await exportFails(function(rlsFaileds){
		if (rlsFaileds == undefined){} else {
		rlsFaileds.forEach(async function(rlsFails){
			if (cli.users.cache.get(rlsFails.id) == undefined) return;
			await data.channel.send(`-changelogs ${rlsFails.id} add f ${rlsFails.failedRuns}`);
		})
		}
	})

	await exportAssists(function(rlsAssisteds){
		if (rlsAssisteds == undefined){} else {
		rlsAssisteds.forEach(async function(rlsAssists){
			if (cli.users.cache.get(rlsAssists.id) == undefined) return;
			await data.channel.send(`-changelogs ${rlsAssists.id} add a ${rlsAssists.assistedRuns}`);
		})
		}
	})

	await exportKeys(function(raidersKeyeds){
		if (raidersKeyeds == undefined){} else {
		raidersKeyeds.forEach(async function(raiderKeys){
			if (cli.users.cache.get(raiderKeys.id) == undefined) return;
			await data.channel.send(`-changelogs ${raiderKeys.id} add kp ${raiderKeys.fungalPop}`);
		})
		}
	})

}

module.exports = exportLogs;