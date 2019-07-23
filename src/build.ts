import * as cm from "./common";
import * as vm from "azure-devops-node-api";

import * as ba from "azure-devops-node-api/BuildApi";
import * as bi from "azure-devops-node-api/interfaces/BuildInterfaces";
import * as ci from 'azure-devops-node-api/interfaces/CoreInterfaces';
import * as corem from 'azure-devops-node-api/CoreApi';

const organizationName = "AviramEzCloud"
const projectName = "EzCloud"; 
const registryName = "ezcloud";
const registryLogin = "d704cfe9-f9ab-4cb8-9802-f1388698aa7c";
const registryPassword = "750ba20f-db41-412c-ae30-c807e7c9ba4f";
const repoUrl = "https://github.com/asafst/EzCloud";
const connectedServiceId = "8025ecf4-04d9-45c6-8645-d0d2875f8858"
const userGithubToken = "de407c6490af9f36342c2d36c32867695c808cce";
const userAzureDevOpsToken = "5d2tey3pxz6m4ydlguavlmkcdkpmcuihexabnsbtoisdbbcmigea";

const buildDefinitionName = "EzCloud-CI-Automation";

export async function CreateNewBuildDefinition(): Promise<bi.BuildDefinition> {
    try
    {
        let vsts: vm.WebApi = await cm.getWebApi(userAzureDevOpsToken, organizationName);
        let coreApi: corem.ICoreApi = await vsts.getCoreApi();
        let taskAgentApi = await vsts.getTaskAgentApi();
        let buildApi: ba.IBuildApi = await vsts.getBuildApi();

        let project: ci.TeamProject = await coreApi.getProject(projectName);
        console.log(`Creating new build definition for project: ${project.name} with id: ${project.id}`);

        let queues = await taskAgentApi.getAgentQueues(project.name);
        let selectedQueue = queues.find(q => q.name.includes('Hosted Ubuntu 1604'));
        if (selectedQueue === undefined)
        {
            console.log('Project needs at least one queue with Hosted Ubuntu 1604 name');
            return;
        }

        let newDef: bi.BuildDefinition = <bi.BuildDefinition>{};

        let defs = await buildApi.getDefinitions(project.name);
        let def = defs.find(d => d.name == buildDefinitionName);
        let isUpdate = false;
        if (def)
        {
            isUpdate = true;
            newDef = def;
        }

        
        let repoName = repoUrl.substring("https://github.com/".length);
        newDef.name = buildDefinitionName;
        newDef.repository = <bi.BuildRepository>{
            type: "GitHub",
            name: repoName,
            id: repoName,
            url: `${repoUrl}.git`,
            defaultBranch: "master",
            properties: {
                "apiUrl": `https://api.github.com/repos/${repoName}`,
                "branchesUrl": `https://api.github.com/repos/${repoName}/branches`,
                "cloneUrl": `https://github.com/${repoName}.git`,
                 "connectedServiceId": connectedServiceId,
                "defaultBranch": "master",
                "fullName": repoName,
                "manageUrl": `https://github.com/${repoName}`,
                "refsUrl": `https://api.github.com/repos/${repoName}/git/refs`,
                "safeRepository": repoName,
                "shortName": "repoName"
            }
        };

        newDef.comment = "Creating a new definition for EzCloud";
        newDef.project = project;
        newDef.queue = selectedQueue;
        newDef.type = 2;

        newDef.process = <bi.YamlProcess>{
            type: 2,
            yamlFilename: "azure-pipelines.yml"
        };

        newDef.variables = {
            "registryName": <bi.BuildDefinitionVariable>{
                value: registryName
            },
            "registryLogin": <bi.BuildDefinitionVariable>{
                value: registryLogin
            },
            "registryPassword": <bi.BuildDefinitionVariable>{
                value: registryPassword
            } 
        }

        if (isUpdate)
        {
            let updatedDef: bi.BuildDefinition = await buildApi.updateDefinition(newDef, project.name, def.id);
            console.log(`Updated definition with name ${updatedDef.name} and id ${updatedDef.id}`);

            return updatedDef;    
        }
        else
        {
            let createdDef: bi.BuildDefinition = await buildApi.createDefinition(newDef, project.name);
            console.log(`Created definition with name ${createdDef.name} and id ${createdDef.id}`);

            return createdDef;
        }

    }
    catch (err) {
        console.error(`Error: ${err.stack}`);
    }

}