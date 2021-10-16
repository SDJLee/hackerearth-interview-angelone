const userService = require('./user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helper = require('../utils/helper');
const errorMessages = require('../utils/constants').errorMessages;

module.exports = {
    login: async (id, password) => {
        const user = await userService.find(id);
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw errorMessages.auth.ERR_LOGIN_UNAUTHORIZED;
        }
        const result = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };
        return result;
    },
    register: async (registrationData) => {
        return await userService.save(registrationData);
    },
    generateJWTToken: (id) => {
        const sessionTimeOut = helper.getEnvironmentConfig().getSessionJWTTimeOut();
        return jwt.sign({
            session: true,
            id
        }, process.env.JWT_SECRET, {
            expiresIn: sessionTimeOut
        });
    },
}
