const { DBConfig, runQ, getQ, userCascadeDelete } = require("../DB");
const { hashPass } = require("./Pass");

const Users = {
    updateUsername,
    removeUser,
    getUser,
    userExists,
    createUser,
    updateUserMoney
}


// User Model
async function updateUserMoney(user_id, newMoney) {
    const { updateById } = DBConfig.users.queries;
    const q = updateById(user_id, {money: newMoney});
    const qRes = await runQ(q);

    if(!qRes.success) console.error(qRes.err);  
    return qRes.success;
}

async function updateUsername(oldUsername, newUsername) {
    const { updateById } = DBConfig.users.queries;
    
    const { id } = await getUser(oldUsername);
    const q = updateById(id, {username: newUsername});
    const qRes = await runQ(q);

    if(!qRes.success) console.error(qRes.err);  

    return qRes.success;
}

async function removeUser(user_id) {
    const { deleteById } = DBConfig.users.queries;

    const res = await runQ(deleteById(user_id));

    if(!res.success) console.error(res.err);

    // Cascade delete all user related models
    await userCascadeDelete(user_id);
}

async function getUser(needle) {
    const { getByUsername, getById } = DBConfig.users.queries;
    let searchQ = isNaN(needle) ? getByUsername(needle) : getById(needle);
    const qRes = await getQ(searchQ);

    if(!qRes.success) console.error(qRes.err);

    // all good
    const { data } = qRes;
    return data;
}

async function userExists(username) {
    const user = await getUser(username);

    return user ? true : false;
}

async function createUser(username, pass, money) {
    // db.users[username] = {
    //     password: hashPass(pass)
    // };
    // check if user already exists
    // run sql
    const { insert } = DBConfig.users.queries;
    const qRes = await runQ(insert(username, hashPass(pass), money));
    if(!qRes.success) console.error(qRes.err);
    return {
        username,
        password: pass
    };
}

module.exports = Users;