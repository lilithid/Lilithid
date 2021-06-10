const fetch = require('node-fetch');
const apiUrl = `https://www.realmeye.com/player/`;
const settings = { method: "Get", headers: {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 OPR/73.0.3856.344"} };

async function getUser(ign){
	let apiBody = await fetch(`${apiUrl}${ign}`, settings)
    .then(res => res.text())
    .then((body) => {
        return body
    });

	let responseBody = apiBody.split('<td>').join('\n');
	let player,guild,guildrank,rank,fame,charactersAmount,skinsAmount,accountFame,exaltationsAmount,accountCreated,lastSeen;
	let description = ['', '', ''];

	if (responseBody.includes('class="player-not-found">')) return `error`;

	let playerParse = 'class="entity-name">';
	let guildParse = 'Guild</td>\n<a href="/guild/';
	let guildRankParse = 'Guild Rank</td>\n';
	let rankParse = 'Rank</td>\n<div class="star-container">';
	let fameParse = 'Fame</td>\n<span class="numeric">';
	let charactersAmountParse = 'Characters</td>\n';
	let skinsAmountParse = 'Skins</td>\n<span class="numeric">';
	let exaltationsAmountParse = 'Exaltations</td>\n<span class="numeric">';
	let accountFameParse = 'Account fame</td>\n<span class="numeric">';
	let accountCreatedParse = 'Created</td>\n';
	let lastSeenParse = 'Last seen</td>\n';
	let descriptionOneParse = '<div class="line1 description-line">';
	let descriptionTwoParse = '<div class="line2 description-line">';
	let descriptionThreeParse = '<div class="line3 description-line">';

	if (responseBody.includes(playerParse)) player = responseBody.split(playerParse)[1].split('<')[0];
	if (responseBody.includes(guildParse)) guild = responseBody.split(guildParse)[1].split('">')[0];
	if (responseBody.includes(guildRankParse)) guildrank = responseBody.split(guildRankParse)[1].split('<')[0];
	if (responseBody.includes(rankParse)) rank = responseBody.split(rankParse)[1].split('<')[0];
	if (responseBody.includes(fameParse)) fame = responseBody.split(fameParse)[1].split('<')[0];
	if (responseBody.includes(charactersAmountParse)) charactersAmount = responseBody.split(charactersAmountParse)[1].split('<')[0];
	if (responseBody.includes(skinsAmountParse)) skinsAmount = responseBody.split(skinsAmountParse)[1].split('<')[0];
	if (responseBody.includes(exaltationsAmountParse)) exaltationsAmount = responseBody.split(exaltationsAmountParse)[1].split('<')[0];
	if (responseBody.includes(accountFameParse)) accountFame = responseBody.split(accountFameParse)[1].split('<')[0];
	if (responseBody.includes(accountCreatedParse)) accountCreated = responseBody.split(accountCreatedParse)[1].split('<')[0];
	if (responseBody.includes(lastSeenParse)) lastSeen = responseBody.split(lastSeenParse)[1].split('<')[0];
	if (responseBody.includes(descriptionOneParse)) description[0] = responseBody.split(descriptionOneParse)[1].split('<')[0];
	if (responseBody.includes(descriptionTwoParse)) description[1] = responseBody.split(descriptionTwoParse)[1].split('<')[0];
	if (responseBody.includes(descriptionThreeParse)) description[2] = responseBody.split(descriptionThreeParse)[1].split('<')[0];

	if (!guild || guild == undefined) guild = 'None';
	if (!guildrank || guildrank == undefined) guildrank = 'None';
	if (!rank || rank == undefined) rank = '0';
	if (!fame || fame == undefined) fame = '0';
	if (!charactersAmount || charactersAmount == undefined) charactersAmount = '0';
	if (!skinsAmount || skinsAmount == undefined) skinsAmount = '0';
	if (!exaltationsAmount || exaltationsAmount == undefined) exaltationsAmount = '0';
	if (!accountCreated || accountCreated == undefined) accountCreated = 'Unknown';
	if (!lastSeen || lastSeen == undefined) lastSeen = 'Unknown';
	if (!description || description == undefined) description[0] = 'No description set.';

	let jsonBody = {
		"player": player,
		"rank": rank,
		"fame": fame,
		"account_fame": accountFame,
		"characters_amount": charactersAmount,
		"exaltations_amount": exaltationsAmount,
		"skins_amount": skinsAmount,
		"guild": guild,
		"guild_rank": guildrank,
		"account_created": accountCreated,
		"last_seen": lastSeen,
		"description": description,
	}

	return jsonBody;
}

async function notfoundCheck(ign){
	let apiBody = await getUser(ign);
	if (apiBody == 'error') return `wrong`;
	if (apiBody.characters_amount == 0) return `wrong`;
	if (apiBody.last_seen != `Unknown` || apiBody.last_seen != `hidden`) return `wrong`;
	if (apiBody.accountCreated == `Unknown`) return `wrong`;
}

/*const undergearedWeapons = ['steel dagger', 'short bow', 'energy staff', 'fire wand', 'short sword', 'rusty katana', 'dirk', 'reinforced bow', 'firebrand staff', 'force wand', 'broad sword', 'kendo stick', 'blue steel dagger', 'crossbow', 'comet staff', 'power wand', 'saber', 'plain katana', 'dusky rose dagger', 'greywood bow', 'serpentine staff', 'missile wand', 'long sword', 'thunder katana', 'silver dagger', 'iron wood bow', 'meteor staff', 'eldritch wand', 'falchion', 'line kutter katana', 'golden dagger', 'fire bow', 'slayer staff', 'hell\'s fire wand', 'fire sword', 'night edge', 'obsidian dagger', 'double bow', 'avenger staff', 'wand of dark magic', 'glass sword', 'sky edge', 'mithril dagger', 'heavy crossbow', 'staff of destruction', 'wand of arcane flame', 'golden sword', 'buster katana', 'fire dagger', 'golden bow', 'staff of horror', 'wand of death', 'ravenheart sword', 'demon edge', 'ragetalon dagger', 'verdant bow', 'staff of necrotic arcana', 'wand of deep sorcery', 'dragonsoul sword', 'jewel eye katana'];
const undergearedAbilities = ['cloak of shadows', 'fire spray spell', 'healing tome', 'combat helm', 'wooden shield', 'seal of the initiate', 'centipede poison', 'necrotic skull', 'hunting trap', 'stasis orb', 'lightning scepter', 'basic star', 'simple wakizashi', 'novice\'s lute', 'cloak of darkness', 'flame burst spell', 'remedy tome', 'bronze helm', 'iron shield', 'seal of the pilgrim', 'spider venom', 'breathtaker skull', 'wilderlands trap', 'suspension orb', 'deception prism', 'discharge scepter', 'four point star', 'steel wakizashi', 'oakwood lute', 'cloak of speed', 'fire nova spell', 'spirit salve tome', 'black iron helm', 'steel shield', 'seal of the seeker', 'pit viper poison', 'heartstealer skull', 'deepforest trap', 'imprisonment orb', 'illusion prism', 'thunderclap scepter', 'spiral shuriken', 'crimson wakizashi', 'iron lute', 'cloak of the night thief', 'elvencraft quiver', 'scorching blast spell', 'tome of rejuvenation', 'red iron helm', 'reinforced shield', 'seal of the aspirant', 'stingray poison', 'soul siphon skull', 'savage trap', 'neutralization orb', 'hallucination prism', 'arcblast scepter', 'silver star', 'enforced wakizashi', 'silver lute'];
const undergearedArmors = ['wolfskin armor', 'robe of the neophyte', 'iron mail', 'leather armor', 'robe of the apprentice', 'chainmail', 'basilisk hide armor', 'robe of the acolyte', 'blue steel mail', 'minotaur hide armor', 'robe of the student', 'silver chainmail', 'bearskin armor', 'robe of the conjurer', 'golden chainmail', 'chimera hide armor', 'robe of the adept', 'plate mail', 'wyvern skin armor', 'robe of the invoker', 'studded leather armor', 'robe of the illusionist', 'mithril armor', 'drake hide armor', 'robe of the master', 'dragonscale armor'];
const undergearedRings = ['ring of minor defense', 'ring of health', 'ring of magic', 'ring of attack', 'ring of defense', 'ring of speed', 'ring of dexterity', 'ring of vitality', 'ring of wisdom', 'ring of greater health', 'ring of greater magic', 'ring of greater attack', 'ring of greater defense', 'ring of greater speed', 'ring of greater dexterity', 'ring of greater vitality', 'ring of greater wisdom', 'ring of superior health', 'ring of superior magic', 'ring of superior attack', 'ring of superior defense', 'ring of superior speed', 'ring of superior dexterity', 'ring of superior vitality', 'ring of superior wisdom'];

async function meetsReqsFungal(ign){
	let apiBody = await getLastUsedCharacter(ign);
	let errors = [];

	try {

	if (apiBody == `${ign} could not be found!`) errors.push(`hidden`);
	if (apiBody == `notfound`) errors.push(`hidden`);

	let level = apiBody.level;
	let maxed = apiBody.stats_maxed;

	if (level != 20) errors.push(`level`);
	if (maxed < 1) errors.push(`stats`);

	if (undergearedWeapons.includes(apiBody.equips.weapon.toLowerCase()) || apiBody.equips.weapon == undefined) errors.push(`weapon`);
	if (undergearedAbilities.includes(apiBody.equips.ability.toLowerCase()) || apiBody.equips.ability == undefined) errors.push(`ability`);
	if (undergearedArmors.includes(apiBody.equips.armor.toLowerCase()) || apiBody.equips.armor == undefined) errors.push(`armor`);
	if (undergearedRings.includes(apiBody.equips.ring.toLowerCase()) || apiBody.equips.ring == undefined) errors.push(`ring`);

	return errors;
	} catch (error) {
		console.error(error);
	}

}*/

async function getItemImage(itemName){
	let fixedName = itemName.trim().replace(/\W/g, '-').toLowerCase();
	let apiBody = await fetch(`https://www.realmeye.com/wiki/${fixedName}`, settings)
    .then(res => res.text())
    .then(body => {
    	return body;
    });
    let classes = ['rogue', 'archer', 'wizard', 'priest', 'warrior', 'knight', 'paladin', 'assassin', 'necromancer', 'huntress', 'mystic', 'trickster', 'sorcerer', 'ninja', 'samurai', 'bard'];
    
    if (classes.includes(itemName.trim())){
    	let fixedUrl = apiBody.split('src="')[2].split('title="')[0].split('"')[0];
    	if (fixedUrl.includes('imgur')) return `${fixedUrl.replace('//', '')}`;
    	return `https://www.realmeye.com${fixedUrl}`;
    }

    if (apiBody.includes('Missing wiki page')) return `unknown item`;
	let fixedUrl = apiBody.split('<img alt="')[1].split('class="img-responsive">')[0].split('//')[1].split('"')[0];
	if (!fixedUrl.startsWith('https://')) fixedUrl = `https://${fixedUrl}`;
	return fixedUrl;
}

/*async function getCharacterList(ign){
	let apiBody = await getCharacters(ign);
	if (apiBody == `notfound`) return `notfound`;
	if (apiBody.hasOwnProperty('error')) return `notfound`;
	let classes = [];

	apiBody.forEach((gameClass) => {
		classes.push(`**${gameClass.class}**\nLevel: \`${gameClass.level}\` CQC: \`${gameClass.cqc}/5\` Fame: \`${gameClass.fame}\` Place: \`${gameClass.place}\` Stats: \`${gameClass.stats_maxed}/8\``);
	})

	return classes;
}*/

module.exports = {
	getUser,
	getItemImage,
}