const User = require('./models/user');

async function initializeTestData() {
    try {
        await User.create({
            user_id: 'TaroYamada',
            password: 'PaSSwd4TY',
            nickname: 'Taro',
            comment: 'I\'m happy.'
        });

        console.log('Test data inserted successfully.');
    } catch (error) {
        console.error('Error initializing test data:', error);
        process.exit(1); // Exit the process if initialization fails
    }
}

module.exports = initializeTestData;