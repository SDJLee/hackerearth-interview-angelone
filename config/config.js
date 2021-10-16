module.exports = {
    development: {
        port: process.env.PORT || 3000,
        saltingRounds: 10,
        getSessionJWTTimeOut: () => {
            return '1h';
        }
    },
    production: {
        port: process.env.PORT || 3000,
        saltingRounds: 10,
        getSessionJWTTimeOut: () => {
            return '1h';
        }
    }
}