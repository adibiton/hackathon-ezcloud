import * as git from "./git";
import * as build from "./build";
import * as release from "./release";

build.run()
//release.run()
    .then(text => {
        console.log(text);
    })
    .catch(err => {
        console.error(err);
    });