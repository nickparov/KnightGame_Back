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
    generateRandNum : (min, max) => Math.floor(Math.random() * max) + min
}