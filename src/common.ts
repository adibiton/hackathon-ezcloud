import * as vm from "azure-devops-node-api";
import * as lim from "azure-devops-node-api/interfaces/LocationsInterfaces";

function getEnv(name: string): string {
    let val = process.env[name];
    if (!val) {
        console.error(`${name} env var not set`);
        process.exit(1);
    }
    return val;
}

export async function getWebApi(token: string, organizationName?: string): Promise<vm.WebApi> {
    let serverUrl = `https://dev.azure.com/${organizationName}`; //getEnv("API_URL");
    return await this.getApi(token, serverUrl);
}

export async function getApi(token: string, serverUrl: string): Promise<vm.WebApi> {
    return new Promise<vm.WebApi>(async (resolve, reject) => {
        try {
            let authHandler = vm.getPersonalAccessTokenHandler(token);
            let option = undefined;

            let vsts: vm.WebApi = new vm.WebApi(serverUrl, authHandler, option);
            let connData: lim.ConnectionData = await vsts.connect();
            console.log(`Running as user: ${connData.authenticatedUser.providerDisplayName}`);
            resolve(vsts);
        }
        catch (err) {
            reject(err);
        }
    });
}

export function getProject(): string {
    return "EzCloud"; //getEnv("API_PROJECT");
}

export function banner(title: string): void {
    console.log("=======================================");
    console.log(`\t${title}`);
    console.log("=======================================");
}

export function heading(title: string): void {
    console.log();
    console.log(`> ${title}`);
}

