const path = require('path');


const { _jsonError } = require("../misc");
const { giveUserHero, fetchRandomHero } = require('../models/Heroes');
const { sessionExists, getSessionUsername, createSession, removeSession, getSession } = require('../models/Sessions');
const { userExists, createUser, getUser } = require('../models/Users');
const { IS_DEV } = require('./Environment');

const Auth = {
    index,
    login,
    logout,
    register,
}


async function index(req, res) {
    const sessionID = req.cookies.sessionID; 
    
    // check if session exists
    if(await sessionExists(sessionID) === true) {
        // TODO getSessionUsername place await before it
        req.sessionData = await getUser(getSessionUsername(sessionID));
        res.redirect("/");
    } 
    // if no session is present 
    else {
        // TODO: redirect CHANGED CHECK IF WORKS
        res.redirect("/login");
    }
};

async function login(req, res) {
    // set new session id associated with username
    const sessionID = await createSession(req.body.username, 180);
    // set cookie
    res.cookie("sessionID", sessionID, { maxAge: 1000 * 60 * 60 * 24 * 30 }); // 30 days
    // send response
    res.redirect("/");
};

async function register(req, res) {
    let userData;
    // check for needed fields
    if (!req.body.hasOwnProperty("password") || !req.body.hasOwnProperty("username")) {
        res.status(404).json(_jsonError("Wrong credentials or user does not exist!"));
        return;
    }

    const { username, password } = req.body;

    if(await userExists(username)) {
        res.status(404).json(_jsonError("User alredy exists!"));
        return;
    }

    userData = await createUser(username, password, 100);
    
    // give random hero to user
    const { id } = await getUser(username);
    // get random heroid
    const randHero = await fetchRandomHero();
    const result = await giveUserHero(id, randHero.id);

    res.json({...userData, id});
}

async function logout(req, res) {
    // get session id 
    const sessionID = req.cookies.sessionID; 
    // remove from db
    if(await removeSession(sessionID)) {
        // redirect to auth
        res.redirect("/auth");
    };
}

module.exports = Auth;