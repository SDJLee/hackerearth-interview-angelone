const loggerName = 'log-angel-one-stock-service';
const log = require('bunyan').createLogger({
    name: "logger",
    streams: [
        {
            stream: process.stdout,
            level: 'debug'
        }, {
            type: 'rotating-file',
            path: `${process.env.LOG_PATH}/${loggerName}.log`,
            name: `${loggerName}-general`,
            level: 'trace',
            period: '1d',   // daily rotation
            count: 3        // keep 3 back copies
        }, {
            type: 'rotating-file',
            path: `${process.env.LOG_PATH}/${loggerName}-error.log`,
            name: `${loggerName}-error`,
            level: 'error',
            period: '1d',   // daily rotation
            count: 3        // keep 3 back copies
        }
    ]
});
const logNames = require('./constants').loggerNames;

function createChild(name) {
    return log.child({ widget_type: name });
}

module.exports = {
    getLog: () => log,
    createChild,
    getAuthLog: () => createChild(logNames.AUTH),
    getStockLog: () => createChild(logNames.STOCK),
    getUserLog: () => createChild(logNames.USER)
}