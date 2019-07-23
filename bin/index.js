#!/usr/bin/env node

require('dotenv').config()
const program = require('commander');
const deploy = require('../lib/deploy');

program
    .command('deploy')
    .description('Deploy your app to Azure')
    .action(function () {
        deploy();
    })
program.parse(process.argv);