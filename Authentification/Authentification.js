import {getService} from "../MongoDB/databaseCommunication.js";

export {loginAsAdmin,tokenIsValid}

function getUser(username) {
    return getService("getByAttribute",{
        collection : "user",
        query : {
            username : username
        }
    })
}

async function loginAsAdmin(hashedPassword) {
    let admin = await getUser("admin")
    console.log(admin)
    if(admin !== null && admin.length > 0) {
        if(hashedPassword === admin[0].password) {
            return {
                token : admin[0].salt
            }
        }
    }
    return null
}

async function tokenIsValid(token) {
    let admin = await getUser("admin")
    console.log(admin)
    if(admin !== null && admin.length > 0) {
        return admin[0].salt === token
    }
    return false
}
