const ValidationError = require("mongoose/lib/error/validation");
const { User } = require("../models/user.model");
const contants = require("../utils/constants");
const logger = require('../utils/logger').getUserLog();
const errorMessages = contants.errorMessages;
const mongooseError = contants.errorCodes.mongoose;


const saveUser = async (userData) => {
    console.log(`user :: saveUser :: `, userData);
    const user = new User({
        ...userData
    });
    await user.save();
    logger.info('user :: saveUser :: saved user', user._id);
    return user;
};

module.exports = {
    find: async (id) => {
        try {
            //find an existing user
            logger.debug('id', id);
            const user = await User.findOne({ username: id });
            if (!user) {
                throw errorMessages.user.ERR_USER_NOT_FOUND;
            }
            return user;
        } catch (error) {
            logger.error(error);
            if (error === errorMessages.user.ERR_USER_NOT_FOUND) {
                throw error;
            }
            throw errorMessages.user.ERR_USER_FETCH_FAILED;
        }
    },
    save: async (userData) => {
        try {
            const { username, email, password } = userData;
            logger.info(`user :: save :: username ${username} :: email ${email}`);
            return await saveUser({
                username, email, password
            });
        } catch (error) {
            console.log("user save error");
            logger.error(error);
            if (error.name === mongooseError.NAME && error.code === mongooseError.DUPLICATE) {
                throw errorMessages.user.ERR_USER_EXISTS;
            } else if (error instanceof ValidationError) {
                throw errorMessages.mongoose.VALIDATION_ERROR;
            } else {
                throw errorMessages.user.ERR_USER_SAVE_FAILED;
            }
        }
    },
}