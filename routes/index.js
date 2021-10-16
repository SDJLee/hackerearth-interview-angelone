const express = require('express');
const { StatusCodes } = require('http-status-codes');
const authController = require('../controller/auth');
const stockController = require('../controller/stock');
const authMw = require('../middleware/auth');

module.exports = {
    route: () => {
        const router = express.Router();
        router.post('/login', authController.login);
        router.post('/register', authController.register);
        router.get('/logout', function (req, res) {
            res.status(StatusCodes.OK).send({ auth: false, token: null });
        });
        router.use('/list-stocks', authMw.verifyToken, stockController.listStocks);
        router.use('/sell', authMw.verifyToken, stockController.sell);
        router.use('/buy', authMw.verifyToken, stockController.buy);
        // router.use('/portfolio', authMw.verifyToken, {});
        // router.use('/tradebook', authMw.verifyToken, {});
        return router;
    }
};