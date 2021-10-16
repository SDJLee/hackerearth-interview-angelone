const authService = require('../services/auth');
const errorMessages = require('../utils/constants').errorMessages;
const statusCodes = require("http-status-codes").StatusCodes;
const logger = require('../utils/logger').getAuthLog();
const userErrors = errorMessages.user;
const mongooseErrors = errorMessages.mongoose;

module.exports = {
    login: async (req, res) => {
        const { id, password } = req.body;
        try {
            const user = await authService.login(id, password);
            const token = authService.generateJWTToken(user._id);
            logger.info(`user ${user.username} logged in`);
            res.status(statusCodes.OK).send({ auth: true, token });
        } catch (error) {
            logger.error(error);
            switch (error) {
                case userErrors.ERR_USER_NOT_FOUND:
                    res.status(statusCodes.NOT_FOUND).send(error);
                    break;
                case errorMessages.auth.ERR_LOGIN_UNAUTHORIZED:
                    res.status(statusCodes.UNAUTHORIZED).send(error);
                    break;
                default:
                    res.status(statusCodes.INTERNAL_SERVER_ERROR).send(error);
                    break;
            }
        }
    },
    register: async (req, res) => {
        try {
            const user = await authService.register(req.body)
            const token = authService.generateJWTToken(user._id);
            logger.info(`user ${user.username} registered`);
            res.status(statusCodes.OK).send({ auth: true, token });
        } catch (error) {
            logger.error(error);
            console.log(error);
            switch (error) {
                case userErrors.ERR_USER_EXISTS:
                    res.status(statusCodes.BAD_REQUEST).send(error);
                    break;
                case userErrors.ERR_USER_SAVE_FAILED:
                    res.status(statusCodes.INTERNAL_SERVER_ERROR).send(error);
                    break;
                case mongooseErrors.VALIDATION_ERROR:
                    res.status(statusCodes.UNPROCESSABLE_ENTITY).send(error)
                    break;
                default:
                    res.status(statusCodes.INTERNAL_SERVER_ERROR).send(error);
                    break;
            }
            return;
        }
    }
}