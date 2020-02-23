const fs = require('fs');
let {logger} = require('../../logger');
const path = require('path');

logger = Object.setPrototypeOf({
    _tag: 'DirectorySynchronizer'
}, logger);

const FILE_ENCODING = 'utf-8';

const DirectorySynchronizer = {
    synchronize(sourceDirectories, targetDirectory, allowList) {
        this.logger.debug();
        sourceDirectories.forEach(sourceDirectory => {
            this.logger.verbose(`synchronizing ${targetDirectory} with ${sourceDirectory}`);
            const files = this._listFiles(sourceDirectory);
            this._allowedFiles(files, allowList).forEach(file => {
                this.logger.verbose(`copying ${file}`);
                let data = this._readFile(sourceDirectory, file);
                data = this.dataTransform(data);
                this._writeFile(targetDirectory, file, data)
            });
        })
    },
    _allowedFiles(files, allowList) {
        this.logger.verbose('filtering disallowed files');
        return files.filter(file => {
            return allowList.reduce((allow, current) => {
                this.logger.debug(`checking ${file} against ${current}`);
                const match = new RegExp(current);
                allow = allow || (file.search(match) !== -1);
                this.logger.debug(`${file} is allowed? ${allow}`);
                return allow;
            }, false);
        });
    },
    _listFiles(directory) {
        this.logger.verbose(`readings files in ${directory}`);
        return this.readDirectory(this.joinPaths(this.__toolDirectory, directory));
    },
    _readFile(directory, filename) {
        this.logger.verbose(`reading in ${filename}`);
        return this.readFile(this.joinPaths(this.__toolDirectory, directory, filename), FILE_ENCODING)
    },
    _writeFile(destination, filename, data) {
        const file = this.joinPaths(destination, filename);
        if (!this._shouldOverrideExistingFiles && this.fileExists(file)) {
            this.logger.verbose(`file exists did not override: ${file}`);
            return;
        }
        this.logger.verbose(`writing ${file}`);
        this.writeFile(file, `${data}\n`, FILE_ENCODING);
    },
    get __toolDirectory() {
        return __dirname;
    },
    get _shouldOverrideExistingFiles() {
        return this.overrideExistingFiles;
    }
};

module.exports = {
    DirectorySynchronizer,
    directorySynchronizer: Object.setPrototypeOf({
        logger,
        overrideExistingFiles: false,
        fileExists: fs.existsSync,
        joinPaths: path.join,
        readDirectory: fs.readdirSync,
        readFile: fs.readFileSync,
        writeFile: fs.writeFileSync,
        dataTransform: (data) => data
    }, DirectorySynchronizer)
};