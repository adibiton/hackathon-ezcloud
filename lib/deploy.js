'use strict';
const { subscription, repoUrl } = require('../ezcloud.json');

module.exports = () => {
    console.log(`Deploying a new App - ${repoUrl} with subscription ${subscription} to Azure`)
    return
}