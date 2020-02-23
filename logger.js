const chalk = require('chalk');

const Logger = {

    verbose(message) {
        if (this._isVerbose) {
            this._log(message, this.styler.magenta);
        }
    },
    debug(message) {
        if (this._isDebug) {
            this._log(message, this.styler.green);
        }
    },
    info(message) {
        this._log(message, this.styler.inverse);
    },
    warn(message) {
        this._log(message, this.styler.yellow);
    },
    error(message) {
        this._log(message, this.styler.red);
    },
    get tag() {
        return this._tag;
    },
    set tag(tag) {
        this._tag(tag);
    },
    _log(message, styleFn) {
        message = styleFn(message || '');
        message = this._preprocess(message);
        this.logger.log(message);
    },
    _preprocess(message) {
        if (this._isDebug && this._tag) {
            const debugMessage = this.styler.green(`${this._tag}#${this.__function}:${this.__line}`);
            message = `${debugMessage} ${message || ''}`;
        }
        return message;
    },
    get _isVerbose() {
        return !!process.env.VERBOSE;
    },
    get _isDebug() {
        return !!process.env.DEBUG;
    },
    get __stack() {
        const orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        const err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        const stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    },
    get __line() {
        return this.__stack[this.__calleeStackNumber].getLineNumber();
    },
    get __function() {
        return this.__stack[this.__calleeStackNumber].getFunctionName();
    },
    get __calleeStackNumber() {
        return 4;
    }
};

module.exports = {
    Logger,
    logger: Object.setPrototypeOf({
        logger: console,
        styler: chalk
    }, Logger)
};