import {interfaceService} from "../MongoDB/databaseManager.js";

export {isTokenAdmin,requestAdminToken,requestToken,tokenExists,registerUser,registerPushToken}

//
function registerUser(id,pwd) {
    console.log(id,pwd)
    return false;
}

async function registerPushToken(id,token) {
    let user = await interfaceService("setAttribute", {
        collection: "user",
        query : {
            username : id
        },
        update : {
            token : token
        }
    })
    return user !== null
}

function tokenExists(token) {
    return true;
}

function isTokenAdmin(token) {
    return false;
}

function requestToken(mac) {
    return 0;
}

function requestAdminToken(mac,pwd) {
    return 0;
}
