'use strict';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = class KubernetesClient {
    async createNamespace(namespace) {
        try {
            const { stdout } = await exec(`kubectl create namespace ${namespace}`);
            console.log('stdout:', stdout);
        } catch (error) {
            return
        } finally {
            console.log(`Kubernetes - Namespace ${namespace} has been created successfully`);
        }
    }

    async createServiceAccount(namespace) {
        try {
            const { stdout } = await exec(`kubectl create serviceaccount tiller --namespace ${namespace}`);
            console.log('stdout:', stdout);
        } catch (error) {
            return
        } finally {
            console.log(`Kubernetes - Service tiller has been created successfully`);
        }
    }

    async createClusterRoleBinding(namespace) {
        try {
            const { stdout } = await exec(`kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=${namespace}:tiller`);
            console.log('stdout:', stdout);
        } catch (error) {
            return
        } finally {
            console.log(`Kubernetes - Cluster role binding (tiller) has been created successfully`);
        }
    }

    async createClusterRoleBindingWithView(namespace) {
        try {
            const { stdout } = await exec(`kubectl create clusterrolebinding default-view --clusterrole=view --serviceaccount=${namespace}:default`);
            console.log('stdout:', stdout);
        } catch (error) {
            return
        } finally {
            console.log(`Kubernetes - Cluster role binding (tiller) has been created successfully`);
        }

    }
}


// k8sApi.listNamespacedPod('default').then((res) => {
//     console.log(res.body);
// });