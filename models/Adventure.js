const crypto = require("crypto");
const { DBConfig, runQ, fatherQ, getQ } = require("../DB");

const Adventure = {
    assignAdventure,
    getAdventureByHero,
    deleteAdventureByHero
}


// Auth Model
async function assignAdventure(hero_id, timestamp) {
    // get insert from queries
    const { insert } = DBConfig.adventures.queries;

    // create adventure for a given hero_id
    const res = fatherQ(await runQ(insert(hero_id, timestamp)));

    return res.success;
}

async function getAdventureByHero(hero_id) {
    const { getByHeroId } = DBConfig.adventures.queries;
    const qRes = await getQ(getByHeroId(hero_id));

    return qRes;
}

async function deleteAdventureByHero(hero_id) {
    const { deleteByHeroId } = DBConfig.adventures.queries;
    const qRes = await runQ(deleteByHeroId(hero_id));

    return qRes.success;
}

module.exports = Adventure;