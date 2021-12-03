const crypto = require("crypto");

const Pass = {
    checkPass,
    hashPass,
}


// Auth Model
async function checkPass(truePass, givenPass) {
    if( hashPass(givenPass) === truePass ) 
        return true;

    return false;
}

function hashPass(pass) {
    return crypto.createHash("sha256").update(pass).digest('hex');
}

module.exports = Pass;