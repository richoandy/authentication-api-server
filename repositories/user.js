const User = require('../models/user');
const user = require('../routes/user');
const { clean } = require('../utils/helper');

module.exports = {
    create: async function (user) {
        const newUser = new User(clean({
            user_id: user.user_id,
            password: user.password,
            nickname: user.nickname,
            comment: user.comment,
        }));

        try {
            return await newUser.save();
        } catch (error) {
            throw error;
        }
    },

    delete: async function (user_id) {
        try {
            const deletedUser = await User.findOneAndDelete({
                user_id
            });

            return deletedUser;
        } catch (err) {
            throw err;
        }
    },

    findOne: async function (user_id) {
        try {
            return await User.findOne({ user_id });
        } catch (error) {
            throw error;
        }
    },

    getOne: async function (user_id, password) {
        try {
            return await User.findOne({
                user_id,
                password
            });
        } catch (error) {
            throw error;
        }
    },

    patch: async function (user_id, body) {
        try {
            return await User.findOneAndUpdate(
                { user_id },
                body,
                { new: true }
            );
        } catch (error) {
            throw error;
        }
    }
};