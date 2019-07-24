'use strict';

const { kubernetesAppsNamespace, kubernetesNamespace, clientId, applicationSecert, domain } = require('../ezcloud.json');

const Containerregistry = require('../lib/resources/acr');
const ResourceGroup = require('../lib/resources/resource-group');
const Aks = require('../lib/resources/aks');
const KubernetesClient = require('../lib/kubectl-client');
const RolesClient = require('../lib/roles-client');
const ActiveDirectoryClient = require('../lib/active-directory-client');

const msRestAzure = require("ms-rest-azure");
async function run() {
    try {
        const creds = await msRestAzure.loginWithServicePrincipalSecret(clientId, applicationSecert, domain);
        //Create resource group
        const resourceGroup = new ResourceGroup(creds)
        await resourceGroup.create()

        //Create conatainer registery
        const containerRegistry = new Containerregistry(creds)
        await containerRegistry.create();

        //Create azure k8s service
        const aks = new Aks(creds);
        await aks.create();

        //const adminCred = await aks.getAdminCredentials();
        //Configure k8s
        const kubernetesClient = new KubernetesClient();
        await kubernetesClient.createServiceAccount(kubernetesNamespace);
        await kubernetesClient.createClusterRoleBinding(kubernetesNamespace);
        await kubernetesClient.createNamespace(kubernetesAppsNamespace);
        await kubernetesClient.createClusterRoleBindingWithView(kubernetesAppsNamespace);

        //Get AKS clientID
        const aksClientId = await aks.getClientID();

        //Get ACR ID
        const acrId = await containerRegistry.getId();

        //Assign relevant role to aks
        const rolesClient = new RolesClient();
        await rolesClient.createAssignment(aksClientId, acrId);

        //Create active directory service principal
        const activeDirectoryClient = new ActiveDirectoryClient();
        const password = await activeDirectoryClient.createServicePrincipal(acrId);
        // console.log(password);

    } catch (err) {
        console.log(JSON.stringify(err));
    }
}

run();

