import * as git from "./git";
import * as build from "./build";
import * as release from "./release";

build.CreateNewBuildDefinition()
    .then(text => {
        console.log(text);
    })
    .catch(err => {
        console.error(err);
    });