const userRepository = require('../repositories/user');
const user = require('./user');

module.exports = {
    basicAuth: async function (req, res, next) {
        const authHeader = req.headers.authorization;

        // verify token's availability
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({
                message: "Authentication Failed"
            });
        }

        const encodedCredentials = authHeader.split(' ')[1];
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
        const [username, password] = decodedCredentials.split(':');

        const user = await userRepository.getOne(username, password);

        if (user) {
            req.loggedInUser = username;
            next();
        } else {
            return res.status(401).json({
                message: "Authentication Failed"
            });
        }
    }
};