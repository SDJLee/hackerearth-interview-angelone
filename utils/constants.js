module.exports = {
    envConstants: {
        DEV: 'development',
        PROD: 'production'
    },
    errorMessages: {
        stock: {
            FETCH_FAILED: 'failed to fetch stocks list',
            INVALID_STOCK_SYMBOL: 'invalid stock',
            INVALID_QUANTITY: 'invalid quantity',
            INVALID_PRICE: 'invalid price',
            STOCK_SELL_FAILED: 'stock sell failed',
            STOCK_BUY_FAILED: 'stock buy failed',
        },
        auth: {
            ERR_LOGIN_UNAUTHORIZED: 'user login failed'
        },
        user: {
            ERR_USER_NOT_FOUND: 'user not found',
            ERR_USER_EXISTS: 'user already exists',
            ERR_USER_SAVE_FAILED: 'user save failed'
        },
        mongoose: {
            VALIDATION_ERROR: 'schema validation failed'
        }
    },
    errorCodes: {
        mongoose: {
            NAME: 'MongoError',
            DUPLICATE: 11000,
        }
    },
    loggerNames: {
        AUTH: "AUTH",
        USER: "USER",
        STOCK: "STOCK"
    },
    cacheStocksList: "stocks-list"
};