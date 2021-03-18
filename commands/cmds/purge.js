async function purge(cli, cfg, data){
	// verify number or not
	const args = data.content.split(' ');

	if (!isNaN(args[1]) && args[1] < 100){
		// is a number
		args[1] -= (-1)
		await cli.channels.cache.find(chan => chan.id == data.channel.id).bulkDelete(args[1]).catch(err => console.error(err));
  		const endedMsg = await data.channel.send(`Succesfuly deleted ${args[1]} messages!`);
		setTimeout(() => {endedMsg.delete()}, 3500);
	} else {
		// not a number
		const endedMsg = await data.channel.send(`Amount of message is not a number or is higher than 99!`);
		setTimeout(() => {data.delete()}, 3500);
		setTimeout(() => {endedMsg.delete()}, 3500);
	}
}

module.exports = purge;