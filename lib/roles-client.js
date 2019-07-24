'use strict';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = class RolesClient {
    async createAssignment(aksClientId, acrId) {
        try {
            await exec(`az role assignment create --assignee ${aksClientId} --role acrpull --scope ${acrId}`);
        } catch (error) {
            return
        } finally {
            console.log(`Azure - Role acrpull has been assigned to ${aksClientId}`);
        }
    }

}
