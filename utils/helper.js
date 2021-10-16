const envConstants = require('./constants').envConstants;
const config = require('../config/config');
const appConfig = require('config');

const environment = process.env.NODE_ENV;
module.exports = {
    isProd : () => process.env.NODE_ENV === envConstants.PROD,
    getEnvironmentConfig: () => {
        return config[environment];
    },
    getAppConfig: () => {
        return appConfig.get(environment);
    }
}