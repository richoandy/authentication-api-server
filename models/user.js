const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
    },
    comment: {
        type: String
    }
});

userSchema.pre('save', async function (next) {
    try {
        if (!this.isNew) {
            return next();
        }

        // Find the highest customId in the collection
        const highestCustomId = await this.constructor.findOne({}, 'id').sort({ id: -1 });

        // Set the customId for the new document
        this.id = highestCustomId ? highestCustomId.id + 1 : 1;

        next();
    } catch (error) {
        next(error);
    }
});

let user = mongoose.model('users', userSchema)

module.exports = user;
