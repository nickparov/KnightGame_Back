const { IS_DEV } = require("./controllers/Environment");

module.exports = {
    _jsonError: function (text, ...payload) {
        return {
            error: text,
            ...payload
        }
    },
    getNowSeconds: function () {
        return Math.round(Date.now() / 1000);
    },
    generateRandNum : (min, max) => Math.floor(Math.random() * max) + min,
    storageApiRoute : IS_DEV() ? "http://localhost:3001" : "https://knight-game-storage-1.herokuapp.com/"
}