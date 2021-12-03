// DB
const sqlite3 = require('sqlite3').verbose();

const { hashPass } = require('./models/Pass');

const dbErrHandler = (err) => err ? console.error(err.message) : null;
const db = new sqlite3.Database('./database/main.db', dbErrHandler);

const DBConfig = {
    sessions: {
        createTableQ: `CREATE TABLE sessions (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_at INTEGER NOT NULL
        );`,
        queries: {
            insert: (id, user_id, expires_at = "NULL") => `INSERT INTO sessions(id, user_id, expires_at) VALUES('${id}', '${user_id}', '${expires_at}');`,
            getById: (id) => `SELECT * FROM sessions WHERE id = '${id}';`,
            deleteById: (id) => `DELETE FROM sessions WHERE id = '${id}';`,
        }
    },
    users: {
        createTableQ: `CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            money INTEGER NOT NULL
        );`,
        queries: {
            insert: (username, password, money) => `INSERT INTO users(username, password, money) VALUES('${username}', '${password}', '${money}');`,
            getById: (id) => `SELECT * FROM users WHERE id = ${id};`,
            deleteById: (id) => `DELETE FROM users WHERE id = ${id};`,
            updateById: (id, data) => `UPDATE users SET ${Object.keys(data).map(key => `${key} = '${data[key]}'`).join(", ")} WHERE id = ${id};`,
            getByUsername: (username) => `SELECT * FROM users WHERE username = '${username}';`,
        }
    },
    heroes: {
        createTableQ: `CREATE TABLE heroes (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            hero_id INTEGER NOT NULL,
            is_available INTEGER NOT NULL
        );`,
        queries: {
            insert: (user_id, hero_id) => `INSERT INTO heroes(user_id, hero_id, is_available) VALUES('${user_id}', '${hero_id}', '1');`,
            getByUserId: (user_id) => `SELECT * FROM heroes WHERE user_id = ${user_id};`,
            deleteById: (id) => `DELETE FROM heroes WHERE id = ${id};`,
            updateAvailabilityById: (id, user_id, is_available) => `UPDATE heroes SET is_available='${is_available}' WHERE id = ${id} AND user_id = ${user_id};`,
        }
    },
    items: {
        createTableQ: `CREATE TABLE items (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            item_id INTEGER NOT NULL
        );`,
        queries: {
            insert: (user_id, item_id) => `INSERT INTO items(user_id, item_id) VALUES('${user_id}', '${item_id}');`,
            getByUserId: (user_id) => `SELECT * FROM items WHERE user_id = ${user_id};`,
            deleteById: (id) => `DELETE FROM items WHERE id = ${id};`,
        }
    },
    adventures: {
        createTableQ: `CREATE TABLE adventures (id INTEGER PRIMARY KEY, hero_id INTEGER NOT NULL, date INTEGER NOT NULL);`,
        queries: {
            insert: (hero_id, date_val) => `INSERT INTO adventures(hero_id, date) VALUES('${hero_id}', '${date_val}');`,
            getByHeroId: (hero_id) => `SELECT * FROM adventures WHERE hero_id = ${hero_id};`,
            deleteByHeroId: (hero_id) => `DELETE FROM adventures WHERE hero_id = ${hero_id};`,
        }
    }
}

async function fatherQ(qRes) {
    try {
        if(!qRes.success) throw new Error(qRes.err);
    } catch(err) {
        console.log(`ERROR:`, err);
    } finally {
        return qRes;
    }
}

function getQ (q)  {
    return new Promise((res) => {
        db.serialize(() => {
            db.get(q, (err, data) => {
                if(err) res({success:false , err});
                res({success: true, data});
            });
        });
    });
}

function runQ (q)  {
    return new Promise((res) => {
        db.serialize(() => {
            db.run(q, (err) => {
                if(err) res({success:false , err});
            });

            res({success: true});
        });
    });
}

function allQ (q)  {
    return new Promise((res) => {
        db.serialize(() => {
            db.all(q, (err, data) => {
                if(err) res({success:false , err});

                res({success: true, data});
            });
        });
    });
}

function showAllRows (table_name)  {
    allQ(`SELECT * FROM ${table_name}`).then(res => {
        console.log(res.data);
    });
}


// SETUP DB:
// boot the db & seed
function seed(numOfEntities = 3) {
    db.serialize(function() {
        
        // seed the db with users
        for(let i = 0; i < numOfEntities; i++) {
            const query = DBConfig.users.queries.insert(`test${i}`, hashPass(`test${i}`), 100);
            // db.run(query);
            runQ(query).then((res) => {
                if(!res.success) console.error(res.err);
            });
        }
        // seed each user with their hero
        for(let i = 0; i < numOfEntities; i++) {
            const query = DBConfig.heroes.queries.insert(i, 0);
            // db.run(query);
            runQ(query).then((res) => {
                if(!res.success) console.error(res.err);
            });
        }
    
        // seed each user with their first items
        for(let i = 0; i < numOfEntities; i++) {
            const query = DBConfig.items.queries.insert(i, 0);
            // db.run(query);
            runQ(query).then((res) => {
                if(!res.success) console.error(res.err);
            });
        }
    
    });
}


// check if seeding was already done
(async function checkSeed() {
    const tables = Object.keys(DBConfig);
    const seededTables = [];
    
    // check each and seed if needed
    for(table of tables) {
        const qRes = await getQ(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='${table}';`);
        const seedDone = qRes.data["count(*)"] === 1;

        // seed if one of the tables are not present
        if(!seedDone) {
            seededTables.push(table);
            await runQ(DBConfig[table].createTableQ);
        }
    }

    // check if all tables were seeded 
    // do the base seed (users, items, ...)
    const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    if(equals(seededTables, tables)) 
        seed();
    
    showAllRows("sessions");
})();


// db.close(dbErrHandler);

module.exports = {
    DBConfig,
    getQ,
    runQ,
    allQ,
    fatherQ,
    showAllRows
};