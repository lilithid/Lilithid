const fetch = require('node-fetch');
const apiUrl = `https://nightfirec.at/realmeye-api/?player=`;
const settings = { method: "Get" };

async function getUser(ign){
	let apiBody = await fetch(`${apiUrl}${ign}`, settings)
    .then(res => res.json())
    .then((json) => {
        return json
    });

    if (apiBody == `${ign} could not be found!`) return `notfound`;
	if (apiBody.hasOwnProperty('error')) return apiBody.error;
	return apiBody;
}

async function getDescription(ign){
	let apiBody = await getUser(ign);
	if (apiBody.hasOwnProperty('error')) return apiBody.error;
	if (apiBody == `notfound`) return `notfound`;
	if (apiBody == `${ign} could not be found!`) return `notfound`;
	if (apiBody == `Invalid player name`) return `notfound`;
	return [apiBody.desc1, apiBody.desc2, apiBody.desc3];
}

async function getCharacters(ign){
	let apiBody = await getUser(ign);
	if (apiBody.hasOwnProperty('error')) return apiBody.error;
	if (apiBody.characters_notfound) return `notfound`;
	if (apiBody == `notfound`) return `notfound`;
	return apiBody.characters;
}

async function getLastUsedCharacter(ign){
	let apiBody = await getUser(ign);
	if (apiBody.hasOwnProperty('error')) return apiBody.error;
	if (apiBody.characters_notfound) return `notfound`;
	if (apiBody == `${ign} could not be found!`) return `notfound`;
	return apiBody.characters[0];
}

async function notfoundCheck(ign){
	let apiBody = await getUser(ign);
	if (apiBody.hasOwnProperty('error')) return `wrong`;
	if (apiBody.characters_notfound) return `wrong`;
	if (apiBody == `${ign} could not be found!`) return `wrong`;
	if (apiBody.player_last_seen != `hidden`) return `wrong`;
	if (apiBody.created == `hidden`) return `wrong`;
}

const undergearedWeapons = ['steel dagger', 'short bow', 'energy staff', 'fire wand', 'short sword', 'rusty katana', 'dirk', 'reinforced bow', 'firebrand staff', 'force wand', 'broad sword', 'kendo stick', 'blue steel dagger', 'crossbow', 'comet staff', 'power wand', 'saber', 'plain katana', 'dusky rose dagger', 'greywood bow', 'serpentine staff', 'missile wand', 'long sword', 'thunder katana', 'silver dagger', 'iron wood bow', 'meteor staff', 'eldritch wand', 'falchion', 'line kutter katana', 'golden dagger', 'fire bow', 'slayer staff', 'hell\'s fire wand', 'fire sword', 'night edge', 'obsidian dagger', 'double bow', 'avenger staff', 'wand of dark magic', 'glass sword', 'sky edge', 'mithril dagger', 'heavy crossbow', 'staff of destruction', 'wand of arcane flame', 'golden sword', 'buster katana', 'fire dagger', 'golden bow', 'staff of horror', 'wand of death', 'ravenheart sword', 'demon edge', 'ragetalon dagger', 'verdant bow', 'staff of necrotic arcana', 'wand of deep sorcery', 'dragonsoul sword', 'jewel eye katana'];
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

}

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

    if (apiBody.includes('Missing wiki page')) return `unknown`;
	let fixedUrl = apiBody.split('<img alt="')[1].split('class="img-responsive">')[0].split('//')[1].split('"')[0];
	return fixedUrl;
}

async function getCharacterList(ign){
	let apiBody = await getCharacters(ign);
	if (apiBody == `notfound`) return `notfound`;
	if (apiBody.hasOwnProperty('error')) return `notfound`;
	let classes = [];

	apiBody.forEach((gameClass) => {
		classes.push(`**${gameClass.class}**\nLevel: \`${gameClass.level}\` CQC: \`${gameClass.cqc}/5\` Fame: \`${gameClass.fame}\` Place: \`${gameClass.place}\` Stats: \`${gameClass.stats_maxed}/8\``);
	})

	return classes;
}

module.exports = {
	getUser,
	getDescription,
	getCharacters,
	getLastUsedCharacter,
	meetsReqsFungal,
	notfoundCheck,
	getItemImage,
	getCharacterList
}