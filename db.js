const mysql = require('mysql');
const cli = require('./main.js');
const SqlString = require('sqlstring');

const db_config = {
	host: 'localhost',
	user: 'root',
	password: 'S6ffe9++',
	database:'fungal'
};

var db;

function handleDisconnect() {
  db = mysql.createConnection(db_config);

  db.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
    console.log(`Connected to Fungals db!`);
  });

  db.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

async function insert_user(userid, ign){
	try {
	isInDBID(userid, async function (result){
		if (result == true){
			// duplicate -> check for name changes
			findbyID(userid, async function (userSQL){
				if (userSQL.ign != ign){
					await db.query(`UPDATE users SET ign = \'${ign}\' WHERE id = \'${userid}\'`);
					console.log(`Updated name change for ign: ${ign}.`);
				} else {
					// duplicate, name is good
					return;
				}
			})
			return;
		} else {
			const sql = await db.query(`INSERT INTO users (id, ign, modmailblacklisted, muteLength, suspendLength, raiderRuns, eventRuns, fungalPop, eventPops, successRuns, failedRuns, assistedRuns, currentWeekParses, activityMeter, currentWeekRuns, currentWeekAssists) VALUES ('${userid}', '${ign}', false, '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0')`);
			console.log(`Verified user into db, id:${userid}, ign: ${ign}.`);
		}
	})
	} catch(err){ console.error(err); }
}


async function remove_user(userid){
	const sql = await db.query(`DELETE FROM users WHERE id = '${userid}'`);
	console.log(`Removed user from db, id: ${userid}.`);
}

async function remove_user_ign(ign){
	const sql = await db.query(`DELETE FROM users WHERE ign = '${ign}'`);
	console.log(`Removed user from db, ign: ${ign}.`);
}

async function isInDB(ign, callback){
	ign = ign.replace(/[^\w\s]/gi, '');
	db.query(`SELECT * FROM users WHERE REGEXP_REPLACE(ign, '[^a-zA-Z ]', '') LIKE '%${ign}%'`, function(err, result){
	if (err) { handleDisconnect(); throw err; }
	if (result[0] != undefined) { if (result[0].ign.length != ign.length) { return callback(false); } };
	if(result.length == 1) return callback(true);
	if(result.length > 1) {
		result.forEach(raider => {
			if (!raider.ign.includes('|') && raider.ign.length == ign.length) return callback(true);
			if (raider.ign.includes('|')) {
				raider.ign.split('|').forEach(splitIgn => {
					if (splitIgn.trim().length == ign.length) return callback(true);
				})
			} else {
				return callback(false);
			}
		})
	}
	if(result.length == 0) return callback(false);
	})
}

async function isInDBID(userid, callback){
	db.query(`SELECT * FROM users WHERE id = '${userid}'`, function(err, result){
	if (err) { handleDisconnect(); throw err; }
	if(result.length == 1) return callback(true);
	if(result.length == 0) return callback(false);
	})
}

async function fixDbName(userid, ign){
	ign = ign.replace(/[^\w|\s]/gi, '');
	await db.query(`UPDATE users SET ign = \'${ign}\' WHERE id = \'${userid}\'`);
	console.log(`Logged into db name change to ${ign}.`)
}

async function findbyID(userid, callback){
	db.query(`SELECT * FROM users WHERE id = '${userid}'`, function(err, result){
	if (err) { handleDisconnect(); throw err; }
	if(result.length == 1) return callback(result[0]);
	if(result.length == 0) return callback(undefined);
	})
}

async function findbyIGN(ign, callback){
	ign = ign.replace(/[^\w\s]/gi, '');
	db.query(`SELECT * FROM users WHERE REGEXP_REPLACE(ign, '[^a-zA-Z ]', '') LIKE '%${ign}%'`, async function(err, result){
	if (err) { handleDisconnect(); throw err; }
	if(result.length == 1) return callback(result[0]);
	if(result.length > 1) {
		result.forEach(raider => {
			if (!raider.ign.includes('|') && raider.ign.length == ign.length) return callback(raider);
			if (raider.ign.includes('|')) {
				raider.ign.split('|').forEach(splitIgn => {
					if (splitIgn.trim().length == ign.length) return callback(raider);
				})
			}
		})
	}
	// if 0 find by id, to fix my shit id/ign conversion
	if(result.length == 0){
		await findbyID(ign, async function(resultTwo){
			if(!resultTwo) return callback(undefined);
			if(resultTwo) return callback(resultTwo);
		})
	}
	})
}

async function pushWarn(userid, modid, reason){
	reason = reason.replace(/[^\w\s]/gi, '');
	await db.query(`INSERT INTO warns (id, modid, reason) VALUES ('${userid}', '${modid}', '${reason}')`);
	console.log(`Warned user: ${userid} for reason: ${reason}.`);
}

async function showWarns(userid, callback){
	db.query(`SELECT * FROM warns WHERE id = '${userid}'`, function(err, result){
	if (err) { handleDisconnect(); throw err; }
	if(result.length >= 1) return callback(result);
	if(result.length == 0) return callback(undefined);
	})
}

async function clearWarns(userid){
	await db.query(`DELETE FROM warns WHERE id = '${userid}'`);
	console.log(`Removed all warns from user ${userid}.`);
}

async function updateSuspMuteTimers(cli, cfg){
	db.query(`SELECT * FROM users WHERE muteLength = 1`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		result.forEach(async raider => {
			// remove muted role
			if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(raider.id) != undefined){
				cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(raider.id).roles.remove(cfg.fungalcavern.mutedRole).catch(err => console.eror(err));
			}
			console.log(`Tried to remove ${raider.ign}s muted role.`);
		});
	})
	db.query(`SELECT * FROM users WHERE suspendLength = 1`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		result.forEach(async raider => {
			// remove muted role
			if (cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(raider.id) != undefined){
				cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(raider.id).roles.remove(cfg.fungalcavern.suspendedRole).catch(err => console.eror(err));
				cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(raider.id).roles.add(cfg.fungalcavern.raiderRole).catch(err => console.eror(err));
			}
			console.log(`Tried to remove ${raider.ign}s suspended role and giving him back raider.`);
		});
	})
	await db.query(`UPDATE users SET muteLength = (+muteLength-1) WHERE muteLength > 0`);
	await db.query(`UPDATE users SET suspendLength = (+suspendLength-1) WHERE suspendLength > 0`);
}

async function suspend(ign, time){
	db.query(`UPDATE users SET suspendLength = \'${time}\' WHERE ign = \'${ign}\'`);
	console.log(`Suspended ign ${ign} for ${time} minutes.`);
}

async function mute(userid, time){
	db.query(`UPDATE users SET muteLength = \'${time}\' WHERE id = \'${userid}\'`);
	console.log(`Muted id ${userid} for ${time} minutes.`);
}

async function unsuspend(cli, cfg, ign, userid){
	db.query(`UPDATE users SET suspendLength = '0' WHERE ign = \'${ign}\'`);
	console.log(`Unsuspended ign ${ign}.`);
	cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(userid).roles.remove(cfg.fungalcavern.suspendedRole).catch(err => console.eror(err));
	cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(userid).roles.remove(cfg.fungalcavern.pSuspendedRole).catch(err => console.eror(err));
	cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(userid).roles.add(cfg.fungalcavern.raiderRole).catch(err => console.eror(err));
}

async function unmute(cli, cfg, userid){
	db.query(`UPDATE users SET muteLength = '0' WHERE id = \'${userid}\'`);
	cli.guilds.cache.get(cfg.fungalcavern.id).members.cache.get(userid).roles.remove(cfg.fungalcavern.mutedRole).catch(err => console.eror(err));
	console.log(`Unmuted id ${userid}.`);
}

async function logRun(userid, amount, type){
	if (isNaN(amount)) amount = '1';

	if (type == 'fail'){
		// failed run
		await db.query(`UPDATE users SET failedRuns = failedRuns+${amount} WHERE id = \'${userid}\'`);
		console.log(`Logged ${amount} failed runs for id ${userid}`);
	} else if (type == 'success'){
		// succesful run
		await db.query(`UPDATE users SET successRuns = successRuns+${amount} WHERE id = \'${userid}\'`);
		await db.query(`UPDATE users SET currentWeekRuns = currentWeekRuns+${amount} WHERE id = \'${userid}\'`);
		console.log(`Logged ${amount} succesful runs for id ${userid}`);
	} else if (type == 'assist'){
		await db.query(`UPDATE users SET assistedRuns = assistedRuns+${amount} WHERE id = \'${userid}\'`);
		await db.query(`UPDATE users SET currentWeekAssists = currentWeekAssists+${amount} WHERE id = \'${userid}\'`);
		console.log(`Logged ${amount} assisted runs for id ${userid}`);
	}
}

async function popKey(userid, amount, type, callback){
	if (type == 'fc'){
		// fungal pops
		await db.query(`UPDATE users SET fungalPop = fungalPop+${amount} WHERE id = \'${userid}\'`);
		console.log(`Logged ${amount} key pops for id ${userid}`);
		db.query(`SELECT * FROM users WHERE id = '${userid}'`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length > 0) return callback(result[0]);
		})
	} else if (type == 'e'){
		// event pops
		await db.query(`UPDATE users SET eventPops = eventPops+${amount} WHERE id = \'${userid}\'`);
		console.log(`Logged ${amount} key pops for id ${userid}`);
		db.query(`SELECT * FROM users WHERE id = '${userid}'`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length > 0) return callback(result[0]);
		})
	}
}

async function runDone(userid, type){
	if (type == 'fc'){
		// fungal runs
		await db.query(`UPDATE users SET raiderRuns = raiderRuns+1 WHERE id = \'${userid}\'`);
	} else if (type == 'e'){
		// event runs
		await db.query(`UPDATE users SET eventRuns = eventRuns+1 WHERE id = \'${userid}\'`);
	}
}

async function addAlt(userid, ign){
	await db.query(`UPDATE users SET ign = CONCAT(ign, ' | ${ign}') WHERE id = '${userid}'`);
	console.log(`Added alt ${ign} for user ${userid}`);
}

async function roat(callback){
	db.query(`SELECT * FROM users WHERE raiderRuns > 0 ORDER BY raiderRuns DESC`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length > 1) return callback(result);
	})
}

async function loat(callback){
	db.query(`SELECT * FROM users WHERE successRuns > 0 ORDER BY successRuns DESC`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length > 1) return callback(result);
	})
}

async function koat(callback){
	db.query(`SELECT * FROM users WHERE fungalPop > 0 ORDER BY fungalPop DESC`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length > 1) return callback(result);
	})
}

async function getModmailblacklistedUsers(callback){
	db.query(`SELECT * FROM users WHERE modmailblacklisted = true`, function(err, result){
	if (err) { handleDisconnect(); throw err; }
	return callback(result);
	})
}

async function insertmodmailblacklisted_user(userid, ign){
	if (!ign) ign = null;
	isInDBID(userid, async function (result){
		if (result == true){
			const sql = await db.query(`UPDATE users SET modmailblacklisted = true WHERE id ='${userid}'`);
			console.log(`Updated user to modmailblacklisted, id:${userid}, ign: ${ign}.`);
		} else {
			const sql = await db.query(`INSERT INTO users (id, ign, modmailblacklisted, muteLength, suspendLength, raiderRuns, eventRuns, fungalPop, eventPops, successRuns, failedRuns, assistedRuns, currentWeekParses, activityMeter, currentWeekRuns, currentWeekAssists) VALUES ('${userid}', '${ign}', true, '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0')`);
			console.log(`Modmail blacklisted user into db, id:${userid}, ign: ${ign}.`);
		}
	})
}

async function unmodmailblacklist(userid){
	const sql = await db.query(`UPDATE users SET modmailblacklisted = false WHERE id = '${userid}'`);
	console.log(`Removed user from modmailblacklist, id:${userid}.`);
}

async function isModmailBlacklisted(userid, callback){
	db.query(`SELECT * FROM users WHERE id = '${userid}' AND modmailblacklisted = true`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length == 1) return callback(true);
		if(result.length == 0) return callback(false);
	})
}

async function getActionLog(userid, callback){
	db.query(`SELECT * FROM actionlog WHERE id = '${userid}'`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length >= 1) return callback(result);
		if(result.length == 0) return callback(undefined);
	})
}

async function pushAction(userid, modid, action, reason, lengthA){
	reason = reason.replace(/[^\w\s]/gi, '');
	if (lengthA == undefined) lengthA = 'None';
	if (reason.length <= 1) reason = 'None specified.';

	await db.query(`INSERT INTO actionlog (id, modid, action, reason, length) VALUES ('${userid}', '${modid}', '${action}', '${reason}', '${lengthA}')`);
	console.log(`Logged action: ${action} for id: ${userid} by ${modid} with reason: ${reason} and time: ${lengthA}.`);
}

async function addParse(userid){
	await db.query(`UPDATE users SET currentWeekParses = currentWeekParses+1 WHERE id = \'${userid}\'`);
	console.log(`Logged a parse for user id ${userid}`);
}

async function resetParses(){
	await db.query(`UPDATE users SET currentWeekParses = '0' WHERE currentWeekParses > 0`);
	console.log(`Reset this current week's parses.`);
}

async function getParseAmount(userid, callback){
	db.query(`SELECT * FROM users WHERE id = \'${userid}\'`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length == 1) return callback(result[0]);
		if(result.length == 0) return callback(undefined);
	})
}

async function fixDuplicateNames(cli, cfg){
	db.query(`SELECT ign FROM users GROUP BY ign HAVING COUNT(ign) > 1;`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		result.forEach(function(raider){
			// if left server and is verified under a new account, remove old one
			remove_user(raider.id);
			remove_user_ign(raider.ign);
		});
	})

	db.query(`SELECT ign FROM expels GROUP BY ign HAVING COUNT(ign) > 1;`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		result.forEach(function(raider){
			db.query(`DELETE FROM expels WHERE ign = '${raider.ign}'`);
		});
	})
}

async function exportSuccesses(callback){
	db.query(`SELECT * FROM users WHERE successRuns > 0`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length > 0) return callback(result);
		if(result.length == 0) return callback(undefined);
	});
}

async function exportFails(callback){
	db.query(`SELECT * FROM users WHERE failedRuns > 0`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length > 0) return callback(result);
		if(result.length == 0) return callback(undefined);
	});
}

async function exportAssists(callback){
	db.query(`SELECT * FROM users WHERE assistedRuns > 0`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length > 0) return callback(result);
		if(result.length == 0) return callback(undefined);
	});
}

async function exportKeys(callback){
	db.query(`SELECT * FROM users WHERE fungalPop > 0`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length > 0) return callback(result);
		if(result.length == 0) return callback(undefined);
	});
}

async function resetLogs(){
	await db.query(`UPDATE users SET assistedRuns = '0' WHERE assistedRuns > 0`);
	await db.query(`UPDATE users SET failedRuns = '0' WHERE failedRuns > 0`);
	await db.query(`UPDATE users SET successRuns = '0' WHERE successRuns > 0`);
	await db.query(`UPDATE users SET fungalPop = '0' WHERE fungalPop > 0`);
	console.log(`Logs were reset!`);
}

async function addActivity(userid, amount){
	await db.query(`UPDATE users SET activityMeter = activityMeter+${amount} WHERE id = \'${userid}\'`);
	console.log(`Logged ${amount} activity points for user id ${userid}`);
}

async function resetActivities(){
	await db.query(`UPDATE users SET activityMeter = '0' WHERE activityMeter > 0`);
	console.log(`Reset this current week's activity.`);
}

async function resetWeekRuns(){
	await db.query(`UPDATE users SET currentWeekRuns = '0' WHERE currentWeekRuns > 0`);
	await db.query(`UPDATE users SET currentWeekAssists = '0' WHERE currentWeekAssists > 0`);
	console.log(`Reset this current week's runs.`);
}

async function getActivity(userid, callback){
	db.query(`SELECT * FROM users WHERE id = \'${userid}\'`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length == 1) return callback(result[0]);
		if(result.length == 0) return callback(undefined);
	})
}

async function dbPing(callback){
	await db.query(`SELECT * FROM users WHERE id = \'202317297266851840\'`, function(err, result){
		if(result.length == 1) return callback(result[0]);
	})
}

async function expelUser(ign){
	await db.query(`INSERT INTO expels (ign) VALUES ('${ign}')`);
	console.log(`Expelled user ${ign}`);
}

async function unexpelUser(ign){
	await db.query(`DELETE FROM expels WHERE ign = \'${ign}\'`);
	console.log(`Unexpelled user ${ign}`);
}

async function isExpelled(ign, callback){
	db.query(`SELECT * FROM expels WHERE REGEXP_REPLACE(ign, '[^a-zA-Z ]', '') LIKE '%${ign}%'`, function(err, result){
		if (err) { handleDisconnect(); throw err; }
		if(result.length > 0) return callback(true);
		if(result.length == 0) return callback(false);
	});
}

async function getExpelledList(callback){
	db.query(`SELECT * FROM expels ORDER BY ign`, function(err, result){
	if (err) { handleDisconnect(); throw err; }
	return callback(result);
	});
}

async function getUsersDb(callback){
	db.query(`SELECT * FROM users`, function(err, result){
	if (err) throw err;
	return callback(result);
	});
}

module.exports = {
	insert_user,
	remove_user,
	remove_user_ign,
	isInDB,
	isInDBID,
	fixDbName,
	findbyIGN,
	findbyID,
	pushWarn,
	showWarns,
	clearWarns,
	updateSuspMuteTimers,
	suspend,
	mute,
	unsuspend,
	unmute,
	logRun,
	popKey,
	addAlt,
	runDone,
	roat,
	loat,
	koat,
	getModmailblacklistedUsers,
	insertmodmailblacklisted_user,
	unmodmailblacklist,
	isModmailBlacklisted,
	getActionLog,
	pushAction,
	addParse,
	resetParses,
	getParseAmount,
	fixDuplicateNames,
	exportSuccesses,
	exportFails,
	exportAssists,
	resetLogs,
	exportKeys,
	addActivity,
	resetActivities,
	getActivity,
	dbPing,
	expelUser,
	unexpelUser,
	isExpelled,
	getExpelledList,
	getUsersDb,
	resetWeekRuns
}