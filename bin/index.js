#!/usr/bin/env node

const program = require('commander');
const ora = require('ora');
const chalk = require('chalk');
const msRestAzure = require("ms-rest-azure");

const { kubernetesAppsNamespace, kubernetesNamespace, clientId, applicationSecret, domain, appName } = require('../ezcloud.json');

const Containerregistry = require('../lib/resources/acr');
const ResourceGroup = require('../lib/resources/resource-group');
const Aks = require('../lib/resources/aks');
const KubernetesClient = require('../lib/kubectl-client');
const RolesClient = require('../lib/roles-client');
const ActiveDirectoryClient = require('../lib/active-directory-client');

async function deploy() {
    try {
        const spinner = ora({ color: 'green', spinner: 'dots10' }).start();
        const creds = await msRestAzure.loginWithServicePrincipalSecret(clientId, applicationSecret, domain);
        //Create resource group
        const resourceGroup = new ResourceGroup(creds);
        await resourceGroup.create();

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
        // console.log(`Active directory password: ${password}`);
        spinner.stop();
        console.log(`Finished deploying ${appName} to Azure succesffully with ${chalk.blue('Ezcloud')}!`);

    } catch (err) {
        console.log(JSON.stringify(err));
    }
}

program
    .command('deploy')
    .description('Deploy your app to Azure')
    .action(deploy);

program.parse(process.argv);