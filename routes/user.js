'use strict';

const express = require('express');
const router = express.Router();

const { basicAuth } = require('../routes/route.middleware');
const userController = require('../controllers/user');

module.exports = function () {
    router.post('/signup', userController.signup);
    router.post('/close', basicAuth, userController.close);
    router.get('/users/:user_id', basicAuth, userController.find);
    router.patch('/users/:user_id', basicAuth, userController.update);

    return router;
}

