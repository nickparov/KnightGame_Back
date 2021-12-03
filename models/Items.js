const fetch = require('node-fetch');
const { DBConfig, allQ, runQ } = require('../DB');


const Items = {
    fetchAll,
    fetchItem,
    fetchUserItemsIds,
    fetchRandomItem,
    deleteUserItemById,
    saveUserItem
}

async function fetchAll() {
    const res = await fetch("http://localhost:3001/items");
    const data = await res.json();

    return data;
}

async function fetchItem(id) {
    const res = await fetch(`http://localhost:3001/items/${id}`);
    const data = await res.json();

    return data;
}

async function fetchRandomItem() {
    const res = await fetch(`http://localhost:3001/items/random`);
    const data = await res.json();

    return data;
}

async function fetchUserItemsIds(user_id) {
    // get all items associated with user
    const q = DBConfig.items.queries.getByUserId(user_id);
    const userItemsIds = await allQ(q);

    return userItemsIds;
}

async function deleteUserItemById(item_id) {
    const q = DBConfig.items.queries.deleteById(item_id);
    const deleteRes = await runQ(q);

    return deleteRes;
}


async function saveUserItem(user_id, item_id) {
    const saveItemQuery = DBConfig.items.queries.insert(user_id, item_id);
    const saveQRes = await runQ(saveItemQuery);

    if(!saveQRes.success) {
        console.log(saveQRes.err);
        return false;
    }
    // TODO return result of query
    return true;
}


module.exports = Items;