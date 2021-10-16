const jwt = require("jsonwebtoken");
const logger = require('../utils/logger').getLog();
const statusCodes = require("http-status-codes").StatusCodes;

module.exports = {
    verifyToken: (req, res, next) => {
        logger.debug('middleware :: verifying token');
        var token = req.headers['x-access-token'];
        if (!token) {
            logger.error('missing token');
            return res.status(statusCodes.FORBIDDEN).send({ auth: false, message: 'missing token' });
        }

        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                logger.error(err);
                return res.status(statusCodes.UNAUTHORIZED).send({ auth: false, message: 'Failed to authenticate token.' });
            }
            req.userId = decoded.id;
            next();
        });
    }

};