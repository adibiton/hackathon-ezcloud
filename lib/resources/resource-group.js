'use strict';

const ResourceManagementClient = require('azure-arm-resource').ResourceManagementClient;
const { subscriptionId, resourceGroupName, location } = require('../../ezcloud.json')

class ResourceGroup {
    constructor(creds) {
        this.creds = creds;
    }
    async create() {
        try {
            const resourceClient = new ResourceManagementClient(this.creds, subscriptionId);
            const groupParameters = { location, tags: { sampletag: 'sampleValue' } };
            const resoureGroup = await resourceClient.resourceGroups.createOrUpdate(resourceGroupName, groupParameters);
            return resoureGroup;
        } catch (error) {
            console.error(error)
        } finally {
            console.log('Azure - resource group created successfully')
        }
    }
}

module.exports = ResourceGroup;