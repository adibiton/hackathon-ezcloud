import * as common from './common';
import * as nodeApi from 'azure-devops-node-api';

import * as ra from 'azure-devops-node-api/ReleaseApi';
import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces';
import * as vi from 'azure-devops-node-api/interfaces/common/VSSInterfaces';

// get from build def output
const buildDefinitionId = "7f9a3258-c003-4c71-a8a6-5a1e45e7b8b1:1";

// get from Adi's output
const organizationName = "AviramEzCloud"
const projectName = "ezcloud";
const registryName = "ezcloud";
const registryLogin = "d704cfe9-f9ab-4cb8-9802-f1388698aa7c";
const registryPassword = "registryPassword";

const releaseDeployPhases = "[{\"deploymentInput\": {\"parallelExecution\": {\"parallelExecutionType\": \"none\"},\"agentSpecification\": null,\"skipArtifactsDownload\": false,\"artifactsDownloadInput\": {\"downloadInputs\": []},\"queueId\": 6,\"demands\": [],\"enableAccessToken\": false,\"timeoutInMinutes\": 0,\"jobCancelTimeoutInMinutes\": 1,\"condition\": \"succeeded()\",\"overrideInputs\": {}},\"rank\": 1,\"phaseType\": 1,\"name\": \"Agent job\",\"refName\": null,\"workflowTasks\": [{\"environment\": {},\"taskId\": \"068d5909-43e6-48c5-9e01-7c8a94816220\",\"version\": \"0.*\",\"name\": \"Install Helm 2.14.1\",\"refName\": \"\",\"enabled\": true,\"alwaysRun\": false,\"continueOnError\": false,\"timeoutInMinutes\": 0,\"definitionType\": \"task\",\"overrideInputs\": {},\"condition\": \"succeeded()\",\"inputs\": {\"helmVersion\": \"2.14.1\",\"checkLatestHelmVersion\": \"false\",\"installKubeCtl\": \"true\",\"kubectlVersion\": \"1.8.9\",\"checkLatestKubeCtl\": \"true\"}},{\"environment\": {},\"taskId\": \"afa7d54d-537b-4dc8-b60a-e0eeea2c9a87\",\"version\": \"0.*\",\"name\": \"helm init\",\"refName\": \"\",\"enabled\": true,\"alwaysRun\": false,\"continueOnError\": false,\"timeoutInMinutes\": 0,\"definitionType\": \"task\",\"overrideInputs\": {},\"condition\": \"succeeded()\",\"inputs\": {\"connectionType\": \"Azure Resource Manager\",\"azureSubscriptionEndpoint\": \"6b710c09-669d-409d-b1b6-d6c2b6d64891\",\"azureResourceGroup\": \"AviramAks\",\"kubernetesCluster\": \"ezcloud\",\"kubernetesServiceEndpoint\": \"\",\"namespace\": \"\",\"command\": \"init\",\"chartType\": \"Name\",\"chartName\": \"\",\"chartPath\": \"\",\"version\": \"\",\"releaseName\": \"\",\"overrideValues\": \"\",\"valueFile\": \"\",\"destination\": \"$(Build.ArtifactStagingDirectory)\",\"canaryimage\": \"false\",\"upgradetiller\": \"true\",\"updatedependency\": \"false\",\"save\": \"true\",\"install\": \"true\",\"recreate\": \"false\",\"resetValues\": \"false\",\"force\": \"false\",\"waitForExecution\": \"true\",\"arguments\": \"--service-account tiller\",\"enableTls\": \"false\",\"caCert\": \"\",\"certificate\": \"\",\"privatekey\": \"\",\"tillernamespace\": \"\"}},{\"environment\": {},\"taskId\": \"6c731c3c-3c68-459a-a5c9-bde6e6595b5b\",\"version\": \"3.*\",\"name\": \"helm repo add\",\"refName\": \"\",\"enabled\": true,\"alwaysRun\": false,\"continueOnError\": false,\"timeoutInMinutes\": 0,\"definitionType\": \"task\",\"overrideInputs\": {},\"condition\": \"succeeded()\",\"inputs\": {\"targetType\": \"inline\",\"filePath\": \"\",\"arguments\": \"\",\"script\": \"helm repo add $(registryName) https://$(registryName).azurecr.io/helm/v1/repo --username $(registryLogin) --password $(registryPassword)\",\"workingDirectory\": \"\",\"failOnStderr\": \"false\",\"noProfile\": \"true\",\"noRc\": \"true\"}},{\"environment\": {},\"taskId\": \"afa7d54d-537b-4dc8-b60a-e0eeea2c9a87\",\"version\": \"0.*\",\"name\": \"helm upgrade\",\"refName\": \"\",\"enabled\": true,\"alwaysRun\": false,\"continueOnError\": false,\"timeoutInMinutes\": 0,\"definitionType\": \"task\",\"overrideInputs\": {},\"condition\": \"succeeded()\",\"inputs\": {\"connectionType\": \"Azure Resource Manager\",\"azureSubscriptionEndpoint\": \"6b710c09-669d-409d-b1b6-d6c2b6d64891\",\"azureResourceGroup\": \"AviramAks\",\"kubernetesCluster\": \"ezcloud\",\"kubernetesServiceEndpoint\": \"\",\"namespace\": \"ezcloudnamespace\",\"command\": \"upgrade\",\"chartType\": \"Name\",\"chartName\": \"$(registryName)/$(projectName)\",\"chartPath\": \"\",\"version\": \"\",\"releaseName\": \"$(projectName)\",\"overrideValues\": \"\",\"valueFile\": \"\",\"destination\": \"$(Build.ArtifactStagingDirectory)\",\"canaryimage\": \"false\",\"upgradetiller\": \"true\",\"updatedependency\": \"false\",\"save\": \"true\",\"install\": \"true\",\"recreate\": \"false\",\"resetValues\": \"false\",\"force\": \"true\",\"waitForExecution\": \"true\",\"arguments\": \"--version $(build.buildId) --set image.repository=$(registryName).azurecr.io/$(projectName) --set image.tag=$(build.buildId) --set ingress.enabled=false\",\"enableTls\": \"false\",\"caCert\": \"\",\"certificate\": \"\",\"privatekey\": \"\",\"tillernamespace\": \"\"}}]}]";

export async function run() {
    try
    {
        const webApi: nodeApi.WebApi = await common.getWebApi(organizationName);
        const releaseApiObject: ra.IReleaseApi = await webApi.getReleaseApi();
        
        // common.banner('Release Samples');

        // common.heading('Get release definition');
        // const releaseDef: ri.ReleaseDefinition = await releaseApiObject.getReleaseDefinition(projectName, 1);
        // console.log(JSON.stringify(releaseDef));

        common.heading('Creating release definition');
        let newDef = getNewReleaseDefinition(buildDefinitionId);
        await releaseApiObject.createReleaseDefinition(newDef, projectName);
    }
    catch (err) {
        console.error(`Error: ${err.stack}`);
    }
}

function getNewReleaseDefinition(buildDefId: string): ri.ReleaseDefinition {
    let newDef: ri.ReleaseDefinition = <ri.ReleaseDefinition>{id: 2, name: "EZCloud Release 2"};
    
    newDef.variables = {
        "projectName": <ri.ConfigurationVariableValue>{
            value: projectName
        },
        "registryName": <ri.ConfigurationVariableValue>{
            value: registryName
        },
        "registryLogin": <ri.ConfigurationVariableValue>{
            value: registryLogin
        },
        "registryPassword": <ri.ConfigurationVariableValue>{
            value: registryPassword
        } 
    };

    let environment: ri.ReleaseDefinitionEnvironment = <ri.ReleaseDefinitionEnvironment>{};
    environment.id = 1;
    environment.name = "Stage 1";
    environment.rank = 1;
    environment.owner = <vi.IdentityRef>{
        displayName: "Aviram Leder",
        id: "d43807ad-2bfc-6398-98b4-25905dc555e5",
        uniqueName: "avleder@microsoft.com",
        descriptor: "aad.ZDQzODA3YWQtMmJmYy03Mzk4LTk4YjQtMjU5MDVkYzU1NWU1"
    };
    environment.deployStep = <ri.ReleaseDefinitionDeployStep>{id: 2};
    environment.deployPhases = JSON.parse(releaseDeployPhases);
    environment.retentionPolicy = <ri.EnvironmentRetentionPolicy>{daysToKeep: 30, releasesToKeep:3, retainBuild: true};

    newDef.environments = <ri.ReleaseDefinitionEnvironment[]>[environment];

    let artifact: ri.Artifact = <ri.Artifact>{
        alias: "_EzCloud-CI", 
        type: "Build", 
        sourceId: buildDefId,
        definitionReference: {
            "definition": <ri.ArtifactSourceReference> {
                id: "1",
                name: "EzCloud-CI"
            },
            "project": <ri.ArtifactSourceReference> {
                id: "7f9a3258-c003-4c71-a8a6-5a1e45e7b8b1",
                name: "EzCloud"
            },
        },
        isPrimary: true,
        isRetained: false
    };
    newDef.artifacts = <ri.Artifact[]>[artifact];

    let trigger: ri.ArtifactSourceTrigger = <ri.ArtifactSourceTrigger>{};
    trigger.triggerType = ri.ReleaseTriggerType.ArtifactSource;
    trigger.artifactAlias = "_EzCloud-CI";
    trigger.triggerConditions = <ri.ArtifactFilter[]>{};
    newDef.triggers = <ri.ArtifactSourceTrigger[]>[trigger];

    return newDef;
}