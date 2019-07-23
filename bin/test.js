'use strict';

const Containerregistry = require('../lib/resources/acr')
const ResourceGroup = require('../lib/resources/resource-group')

const clientId = process.env.CLIENT_ID;
const applicationSecert = process.env.APPLICATION_SECRET;
const domain = process.env.DOMAIN;

const msRestAzure = require("ms-rest-azure");

async function run() {
    const creds = await msRestAzure.loginWithServicePrincipalSecret(clientId, applicationSecert, domain);
    //Create resource group
    const resourceGroup = new ResourceGroup(creds)
    const result = await resourceGroup.create()
    console.log(`Created resource group successfully with the following result: ${JSON.stringify(result)}`)
    //Create conatainer registery
    const containerRegistry = new Containerregistry(creds)
    const containerRegistryResult = await containerRegistry.create();
    console.log(`Created container registry successfully with the following result: ${JSON.stringify(containerRegistryResult)}`);
}

run();
