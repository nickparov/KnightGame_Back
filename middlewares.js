const { getNowSeconds } = require("./misc");
const { sessionExists, getSessionUsername, getSession, removeSession, createSession } = require("./models/Sessions");
const { getUser } = require("./models/Users");


function redirectHandler(req, res, url) {
    isJsonReq = req.is('application/json') === 'application/json';
    // AJAX
    if(isJsonReq) {
        res.json({redirect: url});
    } else {
        // HTML or ELSE
        res.redirect(url);
    }
    
}

// check session
async function SessionMiddleware(req, res, next) {
    var sessionID = req.cookies.sessionID;

    console.log()

    if(!sessionID) {
        redirectHandler(req, res, "/login")
    } 
    else {
        // if such sessionid DO EXISTS
        const foundSession = await getSession(sessionID);

        if(foundSession) {
            const nowSeconds = getNowSeconds();
            const recordSeconds = foundSession.expires_at;
            
            // expired -> update
            if(nowSeconds >= recordSeconds) {
                // remove old session
                await removeSession(sessionID);
                redirectHandler(req, res, "/login")

            } else {
                const sessionUsername = await getSessionUsername(sessionID);
                // append user data to req
                req.sessionData = await getUser(sessionUsername);
                next();
            }
        } // if no such sessionid 
        else {
            redirectHandler(req, res, "/login")
        }
    }
}

/** // TODO Implement in some future
 * Also, impement separate route where session can be updated.
 * // check if its not expired
            const nowSeconds = getNowSeconds();
            const recordSeconds = foundSession.expires_at;
            
            // expired -> update
            if(nowSeconds >= recordSeconds) {
                console.log(sessionID);
                // remove old session
                await removeSession(sessionID);
                // create new session 
                // set new session id associated with username 
                const newSessionID = await createSession(sessionUsername, 300); // 5 mins
                // set updated session cookie
                res.cookie("sessionID", newSessionID, { maxAge: 300000 }); // 5 mins
            }
 */

module.exports = {
    SessionMiddleware
}