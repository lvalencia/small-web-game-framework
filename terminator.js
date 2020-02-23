const {logger} = require('./logger');

const EXIT_FAILURE = 1;
const EXIT_SUCCESS = 0;

const Terminator = {
    success() {
        logger.debug('Terminator#success');
        process.exit(EXIT_SUCCESS);
    },
    failure() {
        logger.debug('Terminator#failure');
        process.exit(EXIT_FAILURE);
    }
};

module.exports = {
    terminator: Object.create(Terminator)
};