import * as cm from "./common";
import * as vm from "azure-devops-node-api";

import * as ba from "azure-devops-node-api/BuildApi";
import * as bi from "azure-devops-node-api/interfaces/BuildInterfaces";
import * as ci from 'azure-devops-node-api/interfaces/CoreInterfaces';

const organizationName = "AviramEzCloud"
const projectName = "EzCloud"; 

export async function run() {
    try
    {
        console.log("starting");
        let vsts: vm.WebApi = await cm.getWebApi(organizationName);
        let vstsBuild: ba.IBuildApi = await vsts.getBuildApi();

        cm.banner("Build Samples");
        console.log("project", projectName);

        // list definitions
        cm.heading(`Build Definitions for ${projectName}`);
        let defs: bi.DefinitionReference[] = await vstsBuild.getDefinitions(projectName);
        
        console.log(`You have ${defs.length} build definition(s)`);

        // save off last def to create a new definition below
        let lastDef: bi.BuildDefinition;
        for (let i: number = 0; i < defs.length; i++) {
            let defRef: bi.DefinitionReference = defs[i];

            let def: bi.BuildDefinition = await vstsBuild.getDefinition(projectName, defRef.id);
            lastDef = def;
            let rep: bi.BuildRepository = def.repository;

            console.log(`${defRef.name} (${defRef.id}) repo ${rep.type}`);
            console.log(JSON.stringify(def));
        }

        // // get top 10 successfully completed builds since 2016
        // cm.heading(`top 10 successfully completed builds for ${project} project`);
        // let builds: bi.Build[] = await vstsBuild.getBuilds(
        //                 project, 
        //                 null,                       // definitions: number[] 
        //                 null,                       // queues: number[]
        //                 null,                       // buildNumber
        //                 null, //new Date(2016, 1, 1),       // minFinishTime
        //                 null,                       // maxFinishTime
        //                 null,                       // requestedFor: string
        //                 bi.BuildReason.All,         // reason
        //                 bi.BuildStatus.Completed,
        //                 bi.BuildResult.Succeeded,
        //                 null,                       // tagFilters: string[]
        //                 null,                        // properties: string[]
        //                 //bi.DefinitionType.Build,
        //                 10                          // top: number
        //                 );
        
        // console.log(`${builds.length} builds returned`);
        // builds.forEach((build: bi.Build) => {
        //     console.log(build.buildNumber, bi.BuildResult[build.result], "on", build.finishTime.toDateString());
        // });

        // new definition

        cm.heading(`Creating new build definition`);
        let newDef: bi.BuildDefinition = <bi.BuildDefinition>{};
        newDef.name = "EzCloud-CI-Automation2";
        newDef.repository = <bi.BuildRepository>{
            type: "GitHub",
            name: "asafst/EzCloud",
            id: "asafst/EzCloud",
            url: "https://github.com/asafst/EzCloud.git",
            defaultBranch: "master"
        };

        newDef.comment = "Trying to create an new definition";
        newDef.project = <ci.TeamProjectReference>{
            name: projectName
        };
        newDef.queue = lastDef.queue;
        newDef.type = 2;

        let process: bi.YamlProcess = {
            type: 2,
            yamlFilename: "azure-build-pipeline-new.yml"
        }

        newDef.process = process;

        newDef.variables = {
            "registryName": <bi.BuildDefinitionVariable>{
                value: "ezcloud"
            },
            "registryLogin": <bi.BuildDefinitionVariable>{
                value: "d704cfe9-f9ab-4cb8-9802-f1388698aa7c"
            },
            "registryPassword": <bi.BuildDefinitionVariable>{
                value: "750ba20f-db41-412c-ae30-c807e7c9ba4f"
            } 
        }

        console.log("creating");                
        let createdDef: bi.BuildDefinition = await vstsBuild.createDefinition(newDef, projectName);
        console.log("created", createdDef.name);

        // console.log("reading history");
        // let history = await vstsBuild.getDefinitionRevisions(project, createdDef.id);
        // console.log(`last updated ${history[0].changedDate}`);

        // let document = [
        //     {
        //         op: "replace",
        //         path: "/key1",
        //         value: "/value1"
        //     },
        //     {
        //         op: "replace",
        //         path: "/key2",
        //         value: "/value2"
        //     }
        // ];

        // console.log("setting properties");
        // let updatedProperties = await vstsBuild.updateDefinitionProperties(null, document, project, createdDef.id);
        // console.log(`properties for definition ${createdDef.name}:`);
        // for (let key in updatedProperties.value) {
        //     console.log(`${key} = ${updatedProperties.value[key].$value}`);
        // }
    }
    catch (err) {
        console.error(`Error: ${err.stack}`);
    }

}