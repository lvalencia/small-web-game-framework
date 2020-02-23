const path = require('path');
const {Dependencies} = require('./dependencies');
const {dependencyFetcher} = require('./dependencyFetcher');
const {directoryCreator} = require('./directoryCreator');
const {directorySynchronizer} = require('./directorySynchronizer');
let {logger} = require('../../logger');

logger = Object.setPrototypeOf({
    _tag: 'generate'
}, logger);

const defaults = {
    Dependencies,
    dependencyFetcher,
    directoryCreator,
    directorySynchronizer,
    logger,
    joinPaths: path.join
};

function generate({rootDirectory, targetDirectory, fetchDependencies}, {
    Dependencies,
    dependencyFetcher,
    directoryCreator,
    directorySynchronizer,
    logger,
    joinPaths
} = defaults) {
    logger.debug();
    logger.verbose(`rootDirectory is ${rootDirectory}`);
    logger.verbose(`targetDirectory is ${targetDirectory}`);

    /*
     * Final Output
     *  .
     *  ├── index.html
     *  ├── package.json
     *  ├── public
     *  │   └── js
     *  │       ├── dependencies
     *  │       │   ├── dat.gui.mjs
     *  │       │   ├── stats.mjs
     *  │       │   └── three.mjs
     *  │       └── helpers
     *  │           └── axisGridHelper.mjs
     *  └── server.js
     */

    const targetDirectories = {
        root: targetDirectory,
        js: joinPaths(targetDirectory, 'public', 'js'),
        dependencies: joinPaths(targetDirectory, 'public', 'js', 'dependencies'),
        helpers: joinPaths(targetDirectory, 'public', 'js', 'helpers')
    };

    // Create the Directory Structure
    directoryCreator.createDirectories(Object.values(targetDirectories));

    // Fetch Code Dependencies
    const fetches = dependencyFetcher.fetch([
        Dependencies.Three,
        Dependencies.DatGui,
        Dependencies.Stats
    ], targetDirectories.dependencies, fetchDependencies);

    // Copy / Sync Files
    const sourceDirectories = {
        root: joinPaths('..', 'templates'),
        dependencies: joinPaths('..', 'templates', 'dependencies'),
        helpers: joinPaths('..', 'templates', 'helpers')
    };
    Promise.all(fetches).finally(() => {
        const projectName = targetDirectory.replace(/\W/g, '') || process.cwd().split(path.sep).pop();
        directorySynchronizer.dataTransform = function searchAndReplace(data) {
            this.logger.verbose('replacing template data');
            const toReplace = {
                name: projectName
            };
            Object.keys(toReplace).forEach((key) => {
                const value = toReplace[key];
                this.logger.debug(`replacing ${key} with ${value}`);
                const match = new RegExp(`{${key}}`, 'g');
                data = data.replace(match, value);
            });
            return data;
        };

        directorySynchronizer.synchronize(
            [sourceDirectories.root],
            targetDirectories.root,
            [
                '^.*.html$',
                '^.*.json$',
                '^.*.js$'
            ]
        );
        directorySynchronizer.synchronize(
            [sourceDirectories.root],
            targetDirectories.js,
            [
                '^.*.mjs$'
            ]
        );
        directorySynchronizer.synchronize(
            [sourceDirectories.dependencies],
            targetDirectories.dependencies,
            [
                '^.*.mjs$'
            ]
        );
        directorySynchronizer.synchronize(
            [sourceDirectories.helpers],
            targetDirectories.helpers,
            [
                '^.*.mjs$'
            ]
        );
    });
}

module.exports = {
    generate
};