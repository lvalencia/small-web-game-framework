const dns = require('dns');
const fs = require('fs');
const http = require('http');
let {logger} = require('../../logger');
const path = require('path');

logger = Object.setPrototypeOf({
    _tag: 'DependencyFetcher'
}, logger);

const P99_UPTIME_URL = 'www.google.com';

const SUCCESS = 200;

const DependencyFetcher = {
    fetch(dependencies, targetDirectory, performFetch = true) {
        this.logger.debug();
        if (performFetch) {
            return new Promise((resolve, reject) => {
                this._verifyConnection(() => {
                    this.logger.verbose('starting network calls');
                    const networkCalls = dependencies.map(dependency => {
                        return this._download(dependency, targetDirectory);
                    });
                    resolve(networkCalls);
                }, reject);
            });
        }
        return [];
    },
    _download({uri, filename}, targetDirectory) {
        return new Promise((resolve, reject) => {
            this.logger.verbose(`downloading ${filename} from ${uri}`);
            this.getUri(uri, (response) => {
                const {statusCode} = response;
                if (statusCode !== SUCCESS) {
                    this.logger.verbose(`failed to download ${filename} from ${uri}`);
                    reject(`Status Code: ${statusCode}`);
                }

                response.on('data', function (data) {
                    const file = this.joinPaths(targetDirectory, filename);
                    this.appendToFile(file, data);
                });

                response.on('end', () => {
                    this.logger.verbose(`downloaded ${filename} from ${uri}`);
                    resolve();
                });
            });
        })
    },
    _verifyConnection(callback, reject) {
        this.verbose('verifying connection');
        this.resolveUri(P99_UPTIME_URL, function (error) {
            if (error) {
                this.verbose('no internet access');
                reject(error);
            } else {
                this.verbose('internet access');
                callback();
            }
        });
    }
};

module.exports = {
    DependencyFetcher,
    dependencyFetcher: Object.setPrototypeOf({
        resolveUri: dns.resolve,
        getUri: http.get,
        joinPaths: path.join,
        appendToFile: fs.appendFileSync,
        http,
        logger
    }, DependencyFetcher)
};