//az acr create -n $acr -g $rg -l $location --sku Basic
'use strict';
const { subscriptionId, resourceGroupName, registryName, location } = require('../../ezcloud.json');
const ContainerRegistryManagementClient = require("azure-arm-containerregistry");

class Containerregistry {
    constructor(creds) {
        this.creds = creds;
        this.client = new ContainerRegistryManagementClient(this.creds, subscriptionId);
    }
    async create() {
        try {
            return await this.client.registries.create(resourceGroupName, registryName, { sku: { name: 'Basic' }, location });
        } catch (err) {
            console.log('An error occurred:');
        } finally {
            console.log('Azure - container registry created successfully')
        };
    }
    async getId() {
        try {
            const acr = await this.client.registries.get(resourceGroupName, registryName);
            return acr && acr.id;
        } catch (err) {
            console.log('An error occurred:');
        };
    }
}

module.exports = Containerregistry;