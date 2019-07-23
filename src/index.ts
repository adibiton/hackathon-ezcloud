import * as git from "./git";
import * as build from "./build";

build.run()
    .then(text => {
        console.log(text);
    })
    .catch(err => {
        console.error(err);
    });