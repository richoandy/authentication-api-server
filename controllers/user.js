const _ = require('lodash');
const Joi = require('joi');
const userRepository = require('../repositories/user');
const user = require('../routes/user');
const { clean } = require('../utils/helper');

module.exports = {
    signup: async function (req, res) {
        const userIdSchema = Joi.string()
            .required()
            .regex(/^[a-zA-Z0-9]{6,20}$/)
            .message('The user id must be 6 to 20 characters long and contain only alphanumeric characters.');

        const userIdSchemaCheck = userIdSchema.validate(req.body.user_id);

        if (userIdSchemaCheck.error) {
            return res.status(400).json({
                message: 'account creation failed',
                cause: userIdSchemaCheck.error.message
            });
        }

        const passwordSchema = Joi.string()
            .required()
            .min(8)
            .max(20)
            .regex(/^[!-~]{8,20}$/) // Matches ASCII printable characters (excluding space)
            .message('The password must be 8 to 20 characters long and contain only valid symbols.');

        const passwordSchemaCheck = passwordSchema.validate(req.body.password);

        if (passwordSchemaCheck.error) {
            return res.status(400).json({
                message: 'account creation failed',
                cause: passwordSchemaCheck.error.message
            });
        }

        try {
            const result = await userRepository.create({
                user_id: req.body.user_id,
                password: req.body.password,
            });

            return res.status(200).json({
                message: "account succesfully created",
                user: {
                    user_id: req.body.user_id,
                    nickname: req.body.user_id,
                }
            });
        } catch (error) {
            try {
                const errors = error.message.split(' ');

                if (errors[1] === 'duplicate') {
                    return res.status(400).json({
                        message: 'account creation failed',
                        cause: 'already same user_id is used'
                    })
                } else {
                    return res.status(500).json({
                        message: "account creation failed",
                        cause: 'server internal error'
                    })
                }
            } catch (err) {
                return res.status(500).json({
                    message: "account creation failed",
                    cause: 'server internal error'
                })
            }
        }
    },

    close: async function (req, res) {
        try {
            await userRepository.delete(req.loggedInUser);
            return res.status(200).json({
                message: 'account and user succesfully removed'
            });
        } catch (error) {
            return res.status(500).json({
                message: 'delete user failed',
                cause: 'internal server error',
            })
        }
    },

    find: async function (req, res) {
        try {
            const user = await userRepository.findOne(req.params.user_id);

            if (user) {
                return res.status(200).json({
                    message: 'user details by user_id',
                    user: clean({
                        user_id: user.user_id,
                        nickname: user.nickname ? user.nickname : user.user_id,
                        comment: user.comment,
                    })
                }
                );
            } else {
                return res.status(404).json({
                    message: 'no user found',
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'get user failed',
                cause: 'internal server error',
            })
        }
    },

    update: async function (req, res) {
        if (req.body.user_id || req.body.password) {
            return res.status(400).json({
                message: 'user updation failed',
                cause: 'not updatable user_id and password'
            });
        }

        if (!req.body.nickname && !req.body.comment) {
            return res.status(400).json({
                message: 'user updation failed',
                cause: 'required nickname or comment'
            });
        }

        if (req.params.user_id !== req.loggedInUser) {
            return res.status(403).json({
                message: 'no permission for update'
            });
        }

        if (req.body.nickname) {
            const nicknameSchema = Joi.string()
                .max(29) // Maximum length of 29 characters (less than 30)
                .regex(/^[^\x00-\x1F\x7F]+$/) // Regex to exclude control codes (ASCII 0-31, 127)
                .allow('') // Allow an empty string
                .messages({
                    'string.max': 'Input must be less than 30 characters',
                    'string.pattern.base': 'Input contains invalid characters (control codes not allowed)'
                });

            const nicknameSchemaCheck = nicknameSchema.validate(req.body.nickname);

            if (nicknameSchemaCheck.error) {
                return res.status(400).json({
                    message: 'account updation failed',
                    cause: nicknameSchemaCheck.error.message
                });
            }
        }

        if (req.body.comment) {
            const commentSchema = Joi.string()
                .max(99) // Maximum length of 99 characters (less than 100)
                .regex(/^[^\x00-\x1F\x7F]+$/) // Regex to exclude control codes (ASCII 0-31, 127)
                .allow('') // Allow an empty string
                .messages({
                    'string.max': 'Input must be less than 100 characters',
                    'string.pattern.base': 'Input contains invalid characters (control codes not allowed)'
                });

            const commentSchemaCheck = commentSchema.validate(req.body.comment);

            if (commentSchemaCheck.error) {
                return res.status(400).json({
                    message: 'account updation failed',
                    cause: commentSchemaCheck.error.message
                });
            }
        }

        const user = await userRepository.findOne(req.params.user_id);
        if (!user) {
            res.status(404).json({
                message: 'no user found'
            });
        }

        try {
            await userRepository.patch(
                req.params.user_id,
                clean({
                    nickname: req.body.nickname,
                    comment: req.body.comment
                })
            );
            return res.status(200).json({
                message: 'user succesfully updated',
                recipe: clean({
                    nickname: req.body.nickname,
                    comment: req.body.comment
                })
            });
        } catch (error) {
            return res.status(500).json({
                message: 'user updation failed',
                cause: 'internal server error',
            });
        }
    }
};