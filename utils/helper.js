const _ = require('lodash');

module.exports = {
    clean: function (obj) {
        // Function to determine keys to omit based on conditions
        // in this case undefined, null, and empty string ('')
        const shouldOmitKey = (value) => {
            return _.isUndefined(value) || _.isNull(value) || value === '';
        };

        // Omit keys based on the shouldOmitKey predicate
        return _.omitBy(obj, shouldOmitKey);
    }
}