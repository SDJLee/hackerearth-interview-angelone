const stockService = require("../services/stock");
const errorMessages = require("../utils/constants").errorMessages;
const statusCodes = require("http-status-codes").StatusCodes;
const logger = require('../utils/logger').getStockLog();

module.exports = {
    listStocks: async (req, res) => {
        try {
            const result = await stockService.listStocks();
            res.status(statusCodes.CREATED).send(result);
        } catch (error) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
    },
    sell: async (req, res) => {
        try {
            const { quantity, price } = req.body;
            if (quantity < 1) {
                res.status(statusCodes.BAD_REQUEST).send(errorMessages.stock.INVALID_QUANTITY);
                return;
            }
            if (price < 1) {
                res.status(statusCodes.BAD_REQUEST).send(errorMessages.stock.INVALID_PRICE);
                return;
            }
            await stockService.sell(req.userId, req.body);
            res.status(statusCodes.OK).send();
        } catch (error) {
            logger.error('stock sell failed with error ', error);
            if (error === errorMessages.mongoose.VALIDATION_ERROR) {
                res.status(statusCodes.NOT_FOUND).send(error);
                return;
            } else if (error === errorMessages.stock.INVALID_STOCK_SYMBOL) {
                res.status(statusCodes.BAD_REQUEST).send(error);
                return;
            }
            res.status(statusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
    },
    buy: async (req, res) => {
        try {
            const { quantity, price } = req.body;
            if (quantity < 1) {
                res.status(statusCodes.BAD_REQUEST).send(errorMessages.stock.INVALID_QUANTITY);
                return;
            }
            if (price < 1) {
                res.status(statusCodes.BAD_REQUEST).send(errorMessages.stock.INVALID_PRICE);
                return;
            }
            await stockService.buy(req.userId, req.body);
            res.status(statusCodes.OK).send();
        } catch (error) {
            logger.error('stock buy failed with error ', error);
            if (error === errorMessages.mongoose.VALIDATION_ERROR) {
                res.status(statusCodes.NOT_FOUND).send(error);
                return;
            } else if (error === errorMessages.stock.INVALID_STOCK_SYMBOL) {
                res.status(statusCodes.BAD_REQUEST).send(error);
                return;
            }
            res.status(statusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
    },
};