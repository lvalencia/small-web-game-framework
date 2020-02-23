#!/usr/bin/env node

const packageJson = require('./package.json');
const VERSION = packageJson.version;
const {logger} = require('./logger');
const {generate} = require('./commands/generate');
const {terminator} = require('./terminator');

const cli = require('commander');
cli.version(VERSION)
    .option('-v, --verbose', 'verbosity', 0);

cli.command('new')
    .alias('init')
    .description('creates a new mica project')
    .action(function newProject(command, options) {
        logger.debug('cli#new');
        generate(options);
    });

cli.command('help')
    .action(function help() {
        logger.debug('cli#help');
        cli.outputHelp();
    });

//  Do not call .command, we do not want '*' showing up on --help
cli.on('command:*', function promptHelp() {
    logger.debug('cli#command:*');
    helpPrompt(cli);
});

cli.on('option:verbose', function () {
    logger.debug('cli#option:verbose');
    process.env.VERBOSE = this.verbose;
});

cli.parse(process.argv);

if (!commandWasEntered(cli)) {
    logger.debug('mica#argCheck');
    helpPrompt(cli);
}

// Helper functions
function helpPrompt(cli) {
    logger.debug('mica#helpPrompt');
    if (!cli.args || cli.args.length === 0) {
        cli.outputHelp();
        terminator.failure();
    }
    logger.error(`Invalid command: ${cli.args.join(' ')}\nSee --help for a list of available commands`);
    terminator.failure();
}

/*
 * This isn't the greatest implementation because it depends on the inner workings of commander
 * i.e. It knows too much about the objects objects
 * But I like that it's tightly coupled to the commands that it has stored and that I don't have
 * to track it separately
 */
function commandWasEntered(cli) {
    let commands = [];
    cli.commands.forEach(({_name, _alias}) => {
        commands.push(_name);
        if (_alias) {
            commands.push(_alias);
        }
    });

    const rawArgs = new Set(process.argv);
    commands = new Set(commands);

    const intersection = new Set([...commands].filter(member => rawArgs.has(member)));
    return intersection.size !== 0;
}
