const crypto = require("crypto");
const { getQ, DBConfig, runQ } = require("../DB");
const { getNowSeconds } = require("../misc");
const { getUser } = require("./Users");

const Sessions = {
    sessionExists,
    getSessionUsername,
    createSession,
    removeSession,
    getSession
}

async function sessionExists(sessionID) {
    const session = await getSession(sessionID);
    return session ? true : false;
}

async function getSession(sessionID) {
    const { getById } = DBConfig.sessions.queries;
    const qRes = await getQ(getById(sessionID));

    if(!qRes.success) {
        console.error(qRes.err);
        return null;
    }
    
    const { data } = qRes;
    return data;
}

async function getSessionUsername(sessionID) {
    const doesSessionExist = await sessionExists(sessionID);
    if(doesSessionExist) {
        const { user_id } = await getSession(sessionID);
        const { username } = await getUser(user_id);

        return username;
    } 

    return null;
}

async function createSession(username, secondsToExpire) {
    // 300000 is default val for seconds
    // generate secs to give val to expires_at
    const expires_at =  getNowSeconds() + secondsToExpire;
    // TODO: HIDE SALT into .env file
    const salt = "PeakyBlinders";
    const saltedUsername = `${salt}${username}`;
    const sessionID = crypto.createHash("sha256").update(saltedUsername).digest('hex');
    
    // find user
    const { id } = await getUser(username);
    // insert into db new session
    const { insert } = DBConfig.sessions.queries;
    const q = insert(sessionID, id, expires_at);
    const qRes = await runQ(q);

    if(!qRes.success) console.error(qRes.err);
    // return session id
    return sessionID;
}

async function removeSession(sessionID) {
    const { deleteById } = DBConfig.sessions.queries;
    const q = deleteById(sessionID);
    const qRes = await runQ(q);

    if(!qRes.success) console.error(qRes.err);

    return qRes.success;
}

module.exports = Sessions;