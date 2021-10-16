const ValidationError = require("mongoose/lib/error/validation");
const { Stock } = require("../models/stock.model");
const contants = require("../utils/constants");
const logger = require('../utils/logger').getUserLog();
const errorMessages = contants.errorMessages;
const cache = require('../utils/cache').cache;
const _ = require('lodash');


//find the existing stock
const findStock = async (symbol) => {
    logger.debug('findStock', symbol);
    return await Stock.findOne({ symbol });
}

const findOrCreateStock = async (symbol) => {
    const stock = await findStock(symbol);
    if (stock) {
        logger.info("stock already exists");
        return stock;
    }
    const cachedStocks = cache.get(contants.cacheStocksList);
    console.log('cached stocks:', JSON.stringify(cachedStocks))
    const cachedStock = _.find(cachedStocks, { 'Stock Symbol': symbol });
    if (!cachedStock) {
        logger.warn("stock not found in cache");
        throw errorMessages.stock.INVALID_STOCK_SYMBOL;
    }
    logger.info("creating new stock");
    const newStock = new Stock({
        symbol: cachedStock['Stock Symbol'],
        name: cachedStock['Security Name'],
        sell: [],
        buy: []
    });
    return newStock;
}

const upsertStock = async (stockData) => {
    console.log(`stock :: upsertStock `, stockData);
    const filter = { symbol: stockData.symbol };
    const update = {
        ...stockData
    };
    const updatedDoc = await Stock.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true // Make this update into an upsert
    });
    logger.info('stock :: upsertStock :: saved stock', updatedDoc._id);
    return updatedDoc;
}

const buyComparator = (compareWith, item) => {
    console.log(`is ${compareWith} < ${item}`);
    return compareWith < item;
}

const sellComparator = (compareWith, item) => {
    console.log(`is ${compareWith} > ${item}`);
    return compareWith > item;
}

const sortItems = (list, item, comparator) => {
    console.log('sorting items: ', JSON.stringify(list))
    var itemToQueue = {
        item,
        priority: item.quantity
    };
    var contain = false;

    for (var i = 0; i < list.length; i++) {
        if (comparator(list[i].quantity, itemToQueue.priority)) {
            console.log(`splicing for ${itemToQueue.priority}`);
            list.splice(i, 0, itemToQueue.item);
            contain = true;
            break;
        }
    }
    if (!contain) {
        console.log(`pushing for ${itemToQueue.priority}`);
        list.push(itemToQueue.item);
    }
    console.log('sorted items: ', JSON.stringify(list))
    return list;
}

// const tradeSell = (sellQueue, buyQueue) => {

// }

// const tradeBuy = (sellQueue, buyQueue) => {

// }


module.exports = {
    listStocks: () => {
        try {
            logger.debug('listStocks');
            return cache.get('stock-list');
        } catch (error) {
            logger.error(error);
            throw errorMessages.stock.FETCH_FAILED;
        }
    },
    sell: async (userId, stockData) => {
        try {
            const { symbol, quantity, price } = stockData;
            logger.info(`selling '${quantity}' number of stock '${symbol}' for '${price}'`)
            const stock = await findOrCreateStock(symbol);
            const sellItems = stock.sell && stock.sell.length > 0 ? stock.sell : [];
            // TODO: check with buy queue, if buyer is available, complete trade.
            // TODO: update user portfolio.
            const sellItem = {
                id: userId,
                price,
                quantity
            };
            stock.sell = sortItems(sellItems, sellItem, sellComparator);
            await upsertStock(stock);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw errorMessages.mongoose.VALIDATION_ERROR;
            } else if (error === errorMessages.stock.INVALID_STOCK_SYMBOL) {
                throw errorMessages.stock.INVALID_STOCK_SYMBOL;
            } else {
                throw errorMessages.stock.STOCK_SELL_FAILED;
            }
        }
    },
    buy: async (userId, stockData) => {
        try {
            const { symbol, quantity, price } = stockData;
            logger.info(`buying '${quantity}' number of stock '${symbol}' for '${price}'`)
            const stock = await findOrCreateStock(symbol);
            const buyItems = stock.buy && stock.buy.length > 0 ? stock.buy : [];
            // TODO: check with sell queue, if seller is available, complete trade.
            // TODO: update user portfolio.
            const buyItem = {
                id: userId,
                price,
                quantity
            };
            stock.buy = sortItems(buyItems, buyItem, buyComparator);
            await upsertStock(stock);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw errorMessages.mongoose.VALIDATION_ERROR;
            } else if (error === errorMessages.stock.INVALID_STOCK_SYMBOL) {
                throw errorMessages.stock.INVALID_STOCK_SYMBOL;
            } else {
                throw errorMessages.stock.STOCK_BUY_FAILED;
            }
        }
    }
}