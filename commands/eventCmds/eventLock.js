async function lock(cli, cfg, data){
    const args = data.content.toLowerCase().split(' ');

    if (args[1] == undefined || isNaN(args[1])) return data.channel.send(`Invalid channel number (available: 1-${cfg.fungalcavern.eventRaidingChannelsAmount})).`);
    if (!isNaN(args[1]) && (args[1] > cfg.fungalcavern.eventRaidingChannelsAmount || args[1] < 1)) return data.channel.send(`Invalid channel number (available: 1-${cfg.fungalcavern.eventRaidingChannelsAmount})).`);

    await cli.channels.cache.get(cfg.fungalcavern.eventVc[args[1]].id).createOverwrite(cfg.fungalcavern.eventRaiderRole, { 'VIEW_CHANNEL': true, 'CONNECT': false, 'SPEAK': false });
    await cli.channels.cache.get(cfg.fungalcavern.eventVc[args[1]].id).setName(cfg.fungalcavern.eventVc[args[1]].name);
    await data.channel.send(`Locked channel ${cfg.fungalcavern.eventVc[args[1]].name.toLowerCase()}`);
}

module.exports = lock;