'use strict';
const { registryName } = require('../ezcloud.json');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = class ActiveDirectoryClient {
    async createServicePrincipal(acrId) {
        try {
            const { stdout } = await exec(`az ad sp create-for-rbac -n ${registryName}-push --scopes ${acrId} --role acrpush`);
            return stdout && JSON.parse(stdout).password
        } catch (error) {
            return
        } finally {
            console.log(`Azure - created active Directory service principal`);
        }
    }

}
