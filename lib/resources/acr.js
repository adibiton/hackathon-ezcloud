//az acr create -n $acr -g $rg -l $location --sku Basic
'use strict';
require('dotenv').config()
const { subscriptionId, resourceGroupName, registryName, location } = require('../../ezcloud.json')
const ContainerRegistryManagementClient = require("azure-arm-containerregistry");

class Containerregistry {
    constructor(creds) {
        this.creds = creds;
    }
    async create() {
        try {
            const client = new ContainerRegistryManagementClient(this.creds, subscriptionId);
            return await client.registries.create(resourceGroupName, registryName, { sku: { name: 'Basic' }, location });
        } catch (err) {
            console.log('An error occurred:');
            console.dir(err, { depth: null, colors: true });
        };
    }
}

module.exports = Containerregistry;