// TODO: Place localstrategy somewhere else
const LocalStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser');
const passport = require('passport');
const express = require('express');
const cors = require('cors');
const path = require('path');

// Env
const { DIRNAME } = require("./controllers/Environment");
const ENVIRONMENT_DIRECTORY = DIRNAME();


// Middlewares
const { 
    SessionMiddleware
} = require('./middlewares');


// TODO move to other place
// async function tryCatchFatherAsync(fn) {
//     return async (req, res) => {
//         try {
//             await fn(req, res);
//         } catch(err) {
//             res.json({error: err})
//         }
//     }
// }

// async function setupTryCatch(controllerObjArr) {
//     for (ctrlObj of controllerObjArr) {
//         // go through each method in controller and wrap into try catch 
//         for(ctrlMethodKey of Object.keys(ctrlObj) ) {
//             ctrlObj[ctrlMethodKey] = await tryCatchFatherAsync(ctrlObj[ctrlMethodKey]);
//         }
//     }
// }

// Controllers
const {
    Auth,
    Profile,
    Game
} = require("./controllers/export");

// Controllers try catch wrap. 
// TODO Check to work
// (async function() {
//     await setupTryCatch([ Auth, Profile, Game ]);
// })();

// create express instance
const app = express()
const port = process.env.PORT || 8080;

// CORS
app.use(cors())
// cookie
app.use(cookieParser());
// json
app.use(express.json())
// passport
app.use(passport.initialize());


const { userExists, getUser } = require("./models/Users");
const { checkPass } = require("./models/Pass");



// check auth form middleware
passport.use(new LocalStrategy(
    async (username, givenPass, done) => {
        // done = done.bind(this, null)
        // check user
        const doesUserExist = await userExists(username);
        if(!doesUserExist) return done(null, false);

        // check pass
        // return done(checkPass(username, password))
        // get users current pass
        const { password } = await getUser(username);
        const passIsOkay = await checkPass(password, givenPass);
        return passIsOkay 
            ? done(null, true) 
            : done(null, false);
     }
))

// AUTH
    // login
    app.post('/auth/login', passport.authenticate('local', { session:false }), Auth.login);
    // register
    app.post('/auth/register', Auth.register);
    // logout
    app.get('/auth/logout', Auth.logout);
    // login/register page
    app.get('/auth', Auth.index);

// PROFILE
    // delete profile
    app.delete('/profile', SessionMiddleware, Profile.delete_);
    // get profile
    app.get('/profile', SessionMiddleware, Profile.getData);
    // update profile
    app.put('/profile', SessionMiddleware, Profile.update);

// GAME
    app.get('/game/user/items', SessionMiddleware, Game.getUserItems);
    app.post('/game/user/items/sell', SessionMiddleware, Game.sellUserItem);
    app.post('/game/user/items/buy', SessionMiddleware, Game.buyUserItem);
    app.get('/game/user/items/random', SessionMiddleware, Game.getRandomItems);


    app.get('/game/user/heroes', SessionMiddleware, Game.getUserHeroes);
    app.post('/game/user/heroes/send', SessionMiddleware, Game.sendUserHero)
    app.post('/game/user/heroes/claim', SessionMiddleware, Game.claimUserHero)
    app.get('/game/user/heroes/random', SessionMiddleware, Game.getRandomHeroes);
    app.post('/game/user/heroes/buy', SessionMiddleware, Game.buyUserHero);

// MEDIUMS
const ItemsModel = require("./models/Items");
// const HeroesModel = require("./models/Heroes");
    // ITEMS
    // show possible items
    app.get('/items', async (req, res) => {
        const data = await ItemsModel.fetchAll();
        res.json(data.slice(0, 10));
    })

    // HEROES
    // fetchHero
    // app.get('/heroes/:id', async (req, res) => {
    //     const data = await HeroesModel.fetchHero(req.params.id);
    //     res.json(data);
    // })
    


// Home 
app.get('/', SessionMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname + `/${ENVIRONMENT_DIRECTORY}/index.html`));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + `/${ENVIRONMENT_DIRECTORY}/auth.html`));
})

app.use(express.static(path.join(__dirname, ENVIRONMENT_DIRECTORY)));

// 404 redirect
// app.get("*", (req, res) => {
//     res.redirect("/");
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});