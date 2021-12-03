const { DBConfig, allQ, showAllRows, runQ } = require("../DB");
const { _jsonError, getNowSeconds, generateRandNum } = require("../misc");
const { fetchUserHeroes, fetchHero, updateUserHero, giveUserHero } = require("../models/Heroes");
const { fetchUserItemsIds, fetchItem, fetchRandomItem, deleteItemById, saveUserItem, deleteUserItemById } = require("../models/Items");
const { updateUserMoney, getUser, userExists } = require("../models/Users");
const { assignAdventure, getAdventureByHero, deleteAdventureByHero } = require("../models/Adventure");
const Users = require("../models/Users");
const Items = require("../models/Items");
const Heroes = require("../models/Heroes");


const Game = {
    // items
    getUserItems,
    sellUserItem,
    buyUserItem,
    getRandomItems,
    // heroes
    getUserHeroes,
    sendUserHero,
    claimUserHero,
    getRandomHeroes,
    buyUserHero
}


async function getRandomHeroes(req, res) {
    let num = null;
    // get num from route query
    num = !req.query.num ? 3 : req.query.num;
    const randomHeroes = [];
    const heroesPromises = [];
    // populate promises
    for(let i = 0; i < 3; i++) {
        heroesPromises.push(await Heroes.fetchRandomHero());
    }
    // fetch them all!
    const promisesResolvedArr = await Promise.all(heroesPromises);
    for(promiseRes of promisesResolvedArr) {
        // promiseRes is hero
        randomHeroes.push(promiseRes);
    }
    res.json(randomHeroes);
}

async function getRandomItems(req, res) {
    let num = null;
    // get num from route query
    num = !req.query.num ? 3 : req.query.num;
    // get items from storage
    const randomItems = [];
    const itemsPromises = [];
    // populate promises
    for(let i = 0; i < 3; i++) {
        itemsPromises.push(await Items.fetchRandomItem());
    }
    // fetch them all!
    const promisesResolvedArr = await Promise.all(itemsPromises);
    for(promiseRes of promisesResolvedArr) {
        // promiseRes is random Item
        randomItems.push(promiseRes);
    }
    res.json(randomItems);
}

async function sellUserItem(req, res) {
    // TODO: add bool whole process success flag
    // on back 
    const { db_id, record_id } = req.body;
    const user_id = req.sessionData.id;
    // get: price of the item <- get from storage api
    const itemData = await fetchItem(record_id);
    const itemPrice = itemData.price;
    // get user money
    const userData = await getUser(user_id);
    const userMoney = userData.money;
    // update: add user amount of money as price of the item
    const updateMoneyRes = await updateUserMoney(user_id, userMoney + itemPrice);
    // delete: item by item_id from user inventory (items_table)
    const deleteRes = await deleteUserItemById(db_id);

    res.json(deleteRes);
}
async function buyUserItem(req, res) {
    // TODO: add bool whole process success flag
    // on back 
    const { record_id } = req.body;
    const user_id = req.sessionData.id;
    // get: price of the item <- get from storage api
    const itemData = await fetchItem(record_id);
    const itemPrice = itemData.price;
    // get user money
    const userData = await getUser(user_id);
    const userMoney = userData.money;

    let updateMoneyRes = false;
    let saveUserRes = false;
    // see if user has enough money to buy it
    if(userMoney - itemPrice >= 0) {
        // buy it
        // update: add user amount of money as price of the item
        updateMoneyRes = await updateUserMoney(user_id, userMoney - itemPrice);
        // add to user arsenal
        saveUserRes = await Items.saveUserItem(user_id, record_id);
    } 
    // bool 
    res.json({success:updateMoneyRes && saveUserRes});
}

async function buyUserHero(req, res) {
    // TODO: add bool whole process success flag
    // on back 
    const { hero_id } = req.body;
    const user_id = req.sessionData.id;
    // get: price of the item <- get from storage api
    const heroData = await fetchHero(hero_id);
    const heroPrice = heroData.price;
    // get user money
    const userData = await getUser(user_id);
    const userMoney = userData.money;

    let updateMoneyRes = false;
    let saveUserRes = false;
    // see if user has enough money to buy it
    if(userMoney - heroPrice >= 0) {
        // buy it
        // update: add user amount of money as price of the item
        updateMoneyRes = await updateUserMoney(user_id, userMoney - heroPrice);
        // add to user arsenal
        saveUserRes = await giveUserHero(user_id, hero_id);
    } 
    // bool 
    res.json({success:updateMoneyRes && saveUserRes});
}

async function getUserItems(req, res) {
    const fetchRes = await fetchUserItemsIds(req.sessionData.id);
    // const fetchRes = await fetchUserItemsIds(1);
    if(!fetchRes.success) res.json(_jsonError("Db issue!"));
    const { data } = fetchRes;
    const itemsData = await Promise.all(data.map(async ({ id, item_id }) => {
        const itemData = await fetchItem(item_id);
        return {
            ...itemData,
            record_id: item_id,
            db_id: id
        }
    }));
    res.json(itemsData);
}

async function getUserHeroes(req, res) {

    const fetchRes = await fetchUserHeroes(req.sessionData.id);
    // const fetchRes = await fetchUserHeroes(1);

    if(!fetchRes.success) res.json(_jsonError("Db issue!"));

    const { data } = fetchRes;

    const heroesData = await Promise.all(data.map(async ({ id, hero_id, is_available }) => {
        const heroData = await fetchHero(hero_id);
        const advRes = await getAdventureByHero(id);

        return {
            ...heroData,
            is_available,
            hero_record_id: id,
            arrivalSeconds: advRes.data ? advRes.data.date : null
        }
    }));
    
    res.json(heroesData);
}   

async function sendUserHero(req, res) {
    // TODO Get user_id from req.sessionData
    const { user_id, hero_record_id } = req.body;
    // update hero record using hero model
    // hero is in adventure
    let uptRes = await updateUserHero(user_id, hero_record_id, 0);
    // TODO Check uptRes for errors
    // create adventure record
    // generate future timestamp
    const currSeconds = getNowSeconds();
    // generate secs to add
    // const days = generateRandNum(1, 3);
    // // convert to seconds
    // const secToAdd = days * 24 * 60 * 60;
    const secToAdd = 5; // 5 seconds
    const timestamp = currSeconds + secToAdd;
    // create adventure
    const advRes = await assignAdventure(hero_record_id, timestamp);
    // fetch the same adventure
    const advData = await getAdventureByHero(hero_record_id);
    // return this new adventure data
    res.json(advData);
    return;

    showAllRows("items");
}

async function claimUserHero(req, res) {
    const { user_id, hero_record_id } = req.body;
    // main data
    const response = { 
        data: {
            item: null, 
            gold: null, 
        },  
        success: true
    };

    // find some item or no?
    if(generateRandNum(0, 101) > 50) {
        // item proc
        response.data.item = await fetchRandomItem();
        
        // save & check item save
        const itemSaved = await saveUserItem(user_id, response.data.item.id);
        if(!itemSaved) 
            response.success = false;
    } 

    if(generateRandNum(0, 101) > 50) {
        response.data.gold = generateRandNum(5, 30);
        // get current user balance
        const { money } = await getUser(user_id);
        // update user money
        await Users.updateUserMoney(user_id, money + response.data.gold);
    }

    // check hero finished adventure
    const wasUpdated = await updateUserHero(user_id, hero_record_id, 1);
    if(!wasUpdated) 
        response.success = false;

    // check delete adventure
    const wasDeleted = await deleteAdventureByHero(hero_record_id);
    if(!wasDeleted) 
        response.success = false;

    res.json(response);
}
  

module.exports = Game;