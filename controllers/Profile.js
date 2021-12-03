const { _jsonError } = require("../misc");
const { removeSession, getSessionUsername, createSession } = require("../models/Sessions");
const { removeUser, getUser, updateUsername } = require("../models/Users");


const Profile = {
    delete_,
    getData,
    update
}

async function delete_(req, res) {
    await removeSession(req.cookies.sessionID);
    await removeUser(req.sessionData.username);
    res.json({ redirectUrl: "/auth" });
}


async function getData(req, res) {
    res.json({...req.sessionData});
    // const data = await getUser(1);
    // res.json({...data});
}

async function update(req, res) {
    const sessionID = req.cookies.sessionID;
    const { newUsername } = req.body;
    // check old vs new username to not match
    const sessionUsername = await getSessionUsername(sessionID);
    if(sessionUsername === newUsername) {
        res.status(500);
        res.end();
    } 
    else {
        const sessionUsername = await getSessionUsername(sessionID);
        // update username
        const updated = await updateUsername(sessionUsername, newUsername);
        if(!updated) { 
            res.status(500);
            res.json(_jsonError("Updating process crashed!"));
            return;
        }
        // remove old session
        await removeSession(sessionID);
        // create new session
        const newSessionID = await createSession(newUsername);
        // send new session id in a cookie
        res.cookie("sessionID", newSessionID, { maxAge: 300000 }); // 5 mins

        const updatedUser = await getUser(newUsername);
        res.json({...updatedUser});
    }
}

module.exports = Profile;