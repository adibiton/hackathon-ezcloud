//az acr create -n $acr -g $rg -l $location --sku Basic
'use strict';
const { subscriptionId, resourceGroupName, location, aks: resourceName, kubernetesVersion, clientId, secret } = require('../../ezcloud.json');
const ContainerServiceClient = require("azure-arm-containerservice");

class Aks {
    constructor(creds) {
        this.creds = creds;
        this.client = new ContainerServiceClient(this.creds, subscriptionId, null, { withCredentials: true });
    }
    async create() {
        try {
            return await this.client.managedClusters.createOrUpdate(resourceGroupName, resourceName,
                {
                    location, kubernetesVersion, servicePrincipalProfile: { clientId, secret },
                    dnsPrefix: 'easycloudcluster-dns',
                    agentPoolProfiles: [{
                        "name": "agentpool",
                        "osDiskSizeGB": 0,
                        "count": 3,
                        "vmSize": "Standard_D2_v2",
                        "osType": "Linux",
                        "storageProfile": "ManagedDisks"
                    }]
                });
        } catch (err) {
            console.log('An error occurred:');
            console.error(err, { depth: null, colors: true });
        } finally {
            console.log('AKS - Created kubernetes service successfully')
        };
    }
    async getId() {
        try {
            const cluster = await this.client.managedClusters.get(resourceGroupName, resourceName);
            return cluster && cluster.id;
        } catch (error) {
            return
        }
    }
    async getClientID() {
        try {
            const cluster = await this.client.managedClusters.get(resourceGroupName, resourceName);
            return cluster && cluster.servicePrincipalProfile && cluster.servicePrincipalProfile.clientId;
        } catch (error) {
            return
        }
    }
    async getAdminCredentials() {
        try {
            const clusterAdminCredentials = await this.client.managedClusters.listClusterAdminCredentials(resourceGroupName, resourceName)
            return {
                name: clusterAdminCredentials['kubeconfigs'][0].name,
                value: clusterAdminCredentials['kubeconfigs'][0].value.toString('utf8')
            }
        } catch (err) {
            console.error(err)
        }
    }


}

module.exports = Aks;