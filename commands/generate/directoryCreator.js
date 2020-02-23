const fs = require('fs');
let {logger} = require('../../logger');
const path = require('path');

logger = Object.setPrototypeOf({
    _tag: 'DirectoryCreator'
}, logger);

const DirectoryCreator = {
    createDirectories(directories) {
        this.logger.debug();
        directories.forEach(directory => {
            this.logger.verbose(`inspecting ${directory}`);
            const individualDirectories = directory.split(this.delimiter);
            let constructedDirectory = '.';
            individualDirectories.forEach(currentDirectory => {
                constructedDirectory = this.joinPaths(constructedDirectory, currentDirectory);
                this.logger.verbose(`checking existence of directory: ${constructedDirectory}`);
                if (!this.directoryExists(constructedDirectory)) {
                    this.logger.verbose(`not found, creating directory: ${constructedDirectory}`);
                    this.makeDirectory(constructedDirectory);
                } else {
                    this.logger.verbose(`found, skipping directory: ${constructedDirectory}`);
                }
            });
        });
    }
};

module.exports = {
    DirectoryCreator,
    directoryCreator: Object.setPrototypeOf({
        joinPaths: path.join,
        delimiter: path.sep,
        directoryExists: fs.existsSync,
        makeDirectory: fs.mkdirSync,
        logger
    }, DirectoryCreator)
};