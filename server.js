require('dotenv').config();
const httpLogger = require('morgan')
const mongoose = require("mongoose");
const routes = require("./routes/index");
const express = require("express");
const helper = require('./utils/helper');
const app = express();
const https = require('https');
const logger = require('./utils/logger').getLog();
const cache = require('./utils/cache').cache;
const contants = require("./utils/constants");

const environmentConfig = helper.getEnvironmentConfig();


const setupStocks = async () => {
    const stocksList = await fetchStocks();
    cache.set(contants.cacheStocksList, stocksList);
};

const fetchStocks = async () => {
    return new Promise((resolve, reject) => {
        // https://s3-ap-southeast-1.amazonaws.com/he-public-data/stocks2b1d6fe.json
        const options = {
            hostname: 's3-ap-southeast-1.amazonaws.com',
            port: 443,
            path: '/he-public-data/stocks2b1d6fe.json',
            method: 'GET'
        }

        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
            res.setEncoding('utf8');
            var str = "";
            res.on('data', function (chunk) {
                str += chunk;
            });
            res.on('end', function () {
                resolve(JSON.parse(str));
            });
        })
        req.on('error', error => {
            console.error(error)
            reject(reject);
        })
        req.end()
    });
};

//connect to mongodb
mongoose
    .connect(process.env.MONGO_LOCAL_CONN_URL, { useNewUrlParser: true })
    .then(() => logger.info("Connected to MongoDB..."))
    .catch(err => logger.error({
        msg: "Could not connect to MongoDB...",
        err
    }));

mongoose.connection.on('connected', function () {
    logger.info("Mongoose default connection is open");
});

mongoose.connection.on('error', function (err) {
    logger.error({
        msg: "Mongoose default connection has occured error",
        err
    });
});

mongoose.connection.on('disconnected', function () {
    logger.info("Mongoose default connection is disconnected");
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        logger.info("Mongoose default connection is disconnected due to application termination");
        process.exit(0)
    });
});

// configure server
app.use(express.json());

if (!helper.isProd()) {
    app.use(httpLogger('dev'));
}

// configure server routes
app.use("/", routes.route());

setupStocks().then(() => {
    // up server
    app.listen(environmentConfig.port, () => console.log(`Listening on port ${environmentConfig.port}...`));
}).catch((err) => {
    logger.error(`terminating server due to error`, err)
    process.exit(1);
});