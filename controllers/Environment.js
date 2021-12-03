module.exports = { 
    IS_DEV: () => process.env.NODE_ENV.includes("development"),
    DIRNAME: () => process.env.NODE_ENV.includes("development") ? "dev" : "prod"
};
