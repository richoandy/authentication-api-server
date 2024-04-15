'use strict';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const initializeTestData = require('./init');

const startApp = async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: 'user_database' });
    console.log('Mongo Connected');

    await initializeTestData();

    // Define global error handler middleware
    app.use((err, req, res, next) => {
        console.error('An error occurred:', err);

        // Respond with an appropriate error status and message
        res.status(500).json({ error: 'Internal Server Error' });
    });

    // Handle uncaught promise rejections
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
    });

    // routes
    app.use(express.json());
    app.use('/', require('./routes/user')());

    app.get('/', (req, res) => {
        res.status(404).json({
            message: "github.com/richoandy/authentication-api-server"
        })
    });

    // start server
    const server = app.listen(port);
    console.log('Express started. Listening on %s', port);
};

startApp();

module.exports = {
    app, startApp
};