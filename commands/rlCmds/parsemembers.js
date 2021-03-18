const { createWorker } = require('tesseract.js');
const { findbyIGN } = require('../../db.js');
const fs = require('fs');
const request = require('request');

var stream = async function(url){
	request(url).pipe(fs.createWriteStream('parsess.png'));
}


async function parse(cli, cfg, data){
	const args = data.content.toLowerCase().split(' ');

	// check args for channel number
	const goodChannelsToLead = ['635542462525472809', '635542647788011521', '635547598668955709', '698467094118924388', '698467148476973097', '698516581709250590', '698517529899040858', '656916239037497355', '656916792006148107'];
	if (!cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel || !goodChannelsToLead.includes(cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(data.author.id).voice.channel.id)) return data.channel.send(`Please join any raiding channel and execute the command again.`);


	// picture url
	var ingamescreen;
	if (data.attachments.size > 0) ingamescreen = data.attachments.first().url;
	if(!ingamescreen) ingamescreen = args[2];
	if (!ingamescreen) return data.channel.send(`No image was input.`);

	await stream(ingamescreen);
	await parseContinue(cli, cfg, data, args, ingamescreen);
}

async function parseContinue(cli, cfg, data, args, ingamescreen){
	try {
		const checkingMessage = await data.channel.send(`Checking raiders and looking for reqs..`);
		const worker = createWorker();

		(async () => {
			await worker.load();
			await worker.loadLanguage('eng');
			await worker.initialize('eng');

			const { data: { text } } = await worker.recognize('parsess.png');
		  
			// Parse text
			const parseText = text.split(':')[1].trim().replace(/\s/g, "");
			const usersIG = parseText.replace(/;/g, ',').toLowerCase().split(',');
			const parseLength = parseInt(text.split(')')[0].trim().substr(16));
			if (!isNaN(parseLength) && parseLength-1 != usersIG.length) await data.channel.send(`Only could parse ${usersIG.length}/${parseLength-1}, some raiders might be missing.`);

			const voiceChannel = data.member.voice.channel;
			const possibleAltsIGNS = [];
			const possibleAltsMentions = [];
			const crashersIGNS = [];
			const crashersMentions = [];

			// crashers
			await usersIG.forEach(async raider => {
				await findbyIGN(raider, function (result){
					// if found: check vc, if not: put as crasher directly
					if (result == undefined) {
						crashersIGNS.push(raider);
						crashersMentions.push(raider);
					} else {
						if (!voiceChannel.members.find(user => user.id == result.id)){
							crashersIGNS.push(raider);
							if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(result.id) == undefined) {
								crashersMentions.push(raider);
							} else {
								crashersMentions.push(`<@${result.id}>`);
							}
						};
					}
				})
			})

			// possible alts
			const inVCnames = [];
			const hasOneAlt = [];
			await voiceChannel.members.forEach(async vcMember => {
				// add every name in vc
				let raiderDisplayName = vcMember.displayName.replace(/[^\w\s]/gi, '');
				if (vcMember.displayName.includes('|')){ await vcMember.displayName.split('|').forEach(async altName => { inVCnames.push(altName.trim().replace(/[^\w\s]/gi, '')); }) } else { inVCnames.push(raiderDisplayName); };
			})

			await inVCnames.forEach(async inVcName => {
				await findbyIGN(inVcName, function (result){
					if (!usersIG.includes(inVcName.toLowerCase())/* && !hasOneAlt.includes(result.id)*/) {
						possibleAltsIGNS.push(inVcName.toLowerCase());
						//hasOneAlt.push(result.id);
					}
				})
			})

			// from ign to id
			await possibleAltsIGNS.forEach(async altIGN => {
				await findbyIGN(altIGN, function (result2){
					// if found: check vc, if not: put as crasher directly
					if (result2 == undefined) { possibleAltsMentions.push(altIGN); } else if(result2.id != data.author.id) { possibleAltsMentions.push(`<@${result2.id}>`); };
				})
			});

			/*const dontMeetLevel = [], dontMeetStats = [], dontMeetWeapon = [], dontMeetAbility = [], dontMeetArmor = [], dontMeetRing = [], couldntFindInfo = [];
			let checkedVC = 0;

			const checkedVCMsg = await data.channel.send(`Checking ${checkedVC}/${inVCnames.length} raiders reqs..`);

			await inVCnames.forEach(async raider => {
				const errors = await meetsReqsFungal(raider);
				checkedVC += 1;
				if (checkedVC % 5 == 0) await checkedVCMsg.edit(`Checking ${checkedVC}/${inVCnames.length} raiders reqs..`);

				if (errors.length < 1) return;
				if (errors.includes(`hidden`)) couldntFindInfo.push(`[${raider}](https://www.realmeye.com/player/${raider})`);
				if (errors.includes(`level`) && !errors.includes(`hidden`)) dontMeetLevel.push(`[${raider}](https://www.realmeye.com/player/${raider})`);
				if (errors.includes(`stats`)) dontMeetStats.push(`[${raider}](https://www.realmeye.com/player/${raider})`);
				if (errors.includes(`weapon`)) dontMeetWeapon.push(`[${raider}](https://www.realmeye.com/player/${raider})`);
				if (errors.includes(`ability`)) dontMeetAbility.push(`[${raider}](https://www.realmeye.com/player/${raider})`);
				if (errors.includes(`armor`)) dontMeetArmor.push(`[${raider}](https://www.realmeye.com/player/${raider})`);
				if (errors.includes(`ring`)) dontMeetRing.push(`[${raider}](https://www.realmeye.com/player/${raider})`);

			})*/


			await setTimeout(async function(){
				// parse formatting
				await checkingMessage.delete();
				var parseMsg = `**These people are in voice channel #${voiceChannel.name} but not in game, possible alts:**\n`;
				parseMsg += `${possibleAltsMentions.join(', ')}\n`;
				parseMsg += `**These people are not in voice channel #${voiceChannel.name}, they are crashers:**\n`;
				parseMsg += `${crashersMentions.join(', ')}\n`;
				parseMsg += `<@&635416899555033118>`;

				if (possibleAltsMentions.length < 1 && crashersMentions.length < 1) var parseMsg = `The parse is fully clean!\n<@&635416899555033118>`;

				await data.channel.send(parseMsg);
				const keyParseMsg = await cli.channels.cache.get(cfg.fungalcavern.parseMembers).send(parseMsg);
				setTimeout(function() { keyParseMsg.delete(); }, 300000);
				/*let EmbedDescription = `Players who do not meet level requirements: ${dontMeetLevel.join(', ')}\nPlayers who do not meet stats requirements: ${dontMeetStats.join(', ')}\nPlayers who do not meet weapon requirements: ${dontMeetWeapon.join(', ')}\nPlayers who do not meet ability requirements: ${dontMeetAbility.join(', ')}\nPlayers who do not meet armor requirements: ${dontMeetArmor.join(', ')}\nPlayers who do not meet ring requirements: ${dontMeetRing.join(', ')}\nPlayers I could not find info on realmeye for: ${couldntFindInfo.join(', ')}`;
				
				const embed = {
					"title": "People who do not meet requirements!",
					"description": `${EmbedDescription}`,
					"color": 5003999
				};

				await data.channel.send({ embed });
				await checkedVCMsg.delete();*/
			}, 10000);

			await worker.terminate();
		})();

	} catch (err) {
		console.error(err);
		return data.channel.send(`There was an error while parsing, please make sure your screenshot is good enough.`);
	};

}

module.exports = parse;