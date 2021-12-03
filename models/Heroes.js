const fetch = require('node-fetch');
const { IS_DEV } = require('../controllers/Environment');
const { DBConfig, allQ, runQ, showAllRows } = require('../DB');
const { storageApiRoute } = require('../misc');
const { getAdventureByHero } = require('./Adventure');

const Heroes = {
    fetchAll,
    fetchHero,
    fetchUserHeroes,
    fetchRandomHero,
    updateUserHero,
    giveUserHero
}

async function fetchAll() {
    const res = await fetch(`${storageApiRoute}/heroes`);
    const data = await res.json();

    return data;
}

async function fetchHero(id) {
    const res = await fetch(`${storageApiRoute}/heroes/${id}`);
    const data = await res.json();

    return data;
}

async function fetchRandomHero() {
    const res = await fetch(`${storageApiRoute}/heroes/random`);
    const data = await res.json();

    return data;
}

async function fetchUserHeroes(user_id) {
    // get all heroes associated with user
    const q = DBConfig.heroes.queries.getByUserId(user_id);
    const qRes = await allQ(q); 

    return qRes;
}

async function updateUserHero(user_id, hero_record_id, is_available) {
    // update record with is_available value
    const uptQ = DBConfig.heroes.queries.updateAvailabilityById(hero_record_id, user_id, is_available);
    const uptQRes = await runQ(uptQ);
    // error check
    if(!uptQRes.success) {
        console.log(uptQRes.err);
        return false;
    }

    return true;
}


async function giveUserHero(user_id, hero_record_id) {
    const insertQ = DBConfig.heroes.queries.insert(user_id, hero_record_id);
    const insertQRes = await runQ(insertQ);
    // TODO check for insert QRes
    return true;
}

module.exports = Heroes;