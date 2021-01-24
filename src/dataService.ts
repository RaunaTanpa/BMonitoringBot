const fs = require('fs');
const diskusage = require('diskusage');
var usrFileName = '../users.json';

var users = {};
var fileLocked = false;

function loadUsers() {
    fs.readFile(usrFileName, (err, data) => {
        if (err) throw err;
        users = JSON.parse(data);
    });
}

async function getFreeMB() {
    try {
        const info = await diskusage.check('/');
        return info.available / 1024 / 1024;
    }
    catch (err) {
        console.error(err);
        return undefined;
    }
}

function saveUsers() {
	if(!fileLocked){
        getFreeMB().then(free => {
            if(free > 100) {
                fileLocked = true;
                var json = JSON.stringify(users);
                fs.writeFile(usrFileName, json, 'utf8', function (err) {
                    if (err) console.trace(err);
                    fileLocked = false;
                });
            }
            else {
                console.log(`Error: can't save user file. Not enough free space left on device (${free} MB)`);
            }
        });
	}
}

/**
 * Meta Data
 * @param {Object} msg
 */
function registerUser(msg) {
    var uid = msg.chat.id;
    var usr = {enabled: true, data: {from: msg.from, chat: msg.chat}};
    users[uid] = usr;
    saveUsers();
}

/**
 * Meta Data
 * @param {Object} uid
 */
function getUser(uid) {
    return users[uid];
}

function getUserList() {
    return Object.keys(users);
}

/**
 * Meta Data
 * @param {Object} uid
 * @param {Object} key
 * @param {Object} val
 */
function setMetaData(uid, key, val) {
    users[uid].data[key] = val;
    saveUsers();
}

/**
 * Meta Data
 * @param {Object} uid
 * @param {Object} key
 */
function getMetaData(uid, key) {
    return users[uid].data[key];
}

export = {
    loadUsers,
    registerUser,
    getUserList,
    setMetaData,
    getMetaData,
};
