const chalk = require('chalk');

const Logger = {
    log(msg) {
        this.logger.log(msg);
    },
    verbose(msg) {
        if (this._isVerbose) {
            msg = this.styler.magenta(msg);
            this.logger.log(msg);
        }
    },
    debug(msg) {
        if (this._isDebug) {
            msg = this.styler.green(msg);
            this.logger.log(msg);
        }
    },
    info(msg) {
        msg = this.styler.inverse(msg);
        this.logger.log(msg);
    },
    warn(msg) {
        msg = this.styler.yellow(msg);
        this.logger.log(msg);
    },
    error(msg) {
        msg = this.styler.red(msg);
        this.logger.log(msg)
    },
    get _isVerbose() {
        return !!process.env.VERBOSE;
    },
    get _isDebug() {
        return !!process.env.DEBUG;
    }
};

module.exports = {
    logger: Object.setPrototypeOf({
        logger: console,
        styler: chalk
    }, Logger)
};