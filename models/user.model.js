const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const helper = require('../utils/helper');

const environmentConfig = helper.getEnvironmentConfig();

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
});

UserSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password') || !user.isNew) {
        next();
    } else {
        bcrypt.hash(user.password, environmentConfig.saltingRounds, function (err, hash) {
            if (err) {
                console.log('Error hashing password for user', user.email);
                next(err);
            } else {
                user.password = hash;
                next();
            }
        });
    }
});

module.exports.User = mongoose.model('User', UserSchema, 'users');