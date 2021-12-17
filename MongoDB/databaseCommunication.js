import {serverconfig} from "../Settings/config.js";

export {getService}

import mc from "mongodb"

const MongoClient = mc.MongoClient

const user = serverconfig.database.username
const pwd = serverconfig.database.password;
const DB_name = serverconfig.database.db_name;
const uri = `${serverconfig.database.mongodbPre}://${serverconfig.database.mongodbSuf}:${serverconfig.database.mongodbPort}`;


console.log(uri)
let publicCollections = [
    "data",
    "devices",
    "rooms",
    "user",
    "pushtokens",
    "config"
]

let serviceParameters = {
    getAll : ["collection"],
    getByAttribute : ["collection","query"],
    setAttribute : ["collection","query","update"],
    addDocument : ["collection","update"],
    removeDocument : ["collection","query"],
    removeAll : ["collection","query"]
}

async function getDBComm() {
    let config = {
        client : new MongoClient(uri),
        db : null
    }
    try {
        await config.client.connect();
        config.db = config.client.db(DB_name)
    } catch (e) {
        console.error(e);
        await config.client.close();
        return null
    }
    return config
}

function checkForCollectionAccess(collection) {
    return publicCollections.includes(collection)
}

function objectHasAllParameters(parameters, object) {
    for(let parameter of parameters) {
        if(!object.hasOwnProperty(parameter)) {
            return false
        }
    }
    return true
}



function allParametersOfServiceExist(service,parameters) {
    let requiredParameters = serviceParameters[service]
    if(requiredParameters) {
        return objectHasAllParameters(requiredParameters,parameters)
    }
    return false
}

async function getAllEntriesOfCollection(db,parameters) {
    return db.collection(parameters["collection"]).find().toArray()
}

async function findByAttribute(db,parameters) {
    return db.collection(parameters["collection"]).find(parameters["query"]).toArray()
}

async function setAttributeOfObjectByQueryattribute(db,parameters) {
    let newvalues = { $set: parameters["update"] };
    return db.collection(parameters["collection"]).updateOne(parameters["query"],newvalues).then((res, err) =>{
        if(res) {
            if(res.acknowledged) {
                return findByAttribute(db,parameters)
            }
        }
        else if(err) {
            console.error(err)
            return null
        }
    })

}

async function insertDocument(db,parameters) {
    return db.collection(parameters["collection"]).insertOne(parameters["update"]).then((res, err) => {
        if(res) {
            if(res.acknowledged) {
                return [parameters["update"]]
            }
        }
        else if(err) {
            console.error(err)
            return null
        }
    });
}

async function removeDocument(db,parameters) {
    return db.collection(parameters["collection"]).deleteOne(parameters["query"]).then((res,err) => {
        if(res) {
            if(res.acknowledged) {
                return true
            }
        }
        else if(err) {
            console.error(err)
            return false
        }
    })
}

async function removeAll(db,parameters) {
    return db.collection(parameters["collection"]).deleteMany(parameters["query"]).then((res,err) => {
        if(res) {
            if(res.acknowledged) {
                return true
            }
        }
        else if(err) {
            console.error(err)
            return false
        }
    })
}

async function getService(service,parameters) {
    if(allParametersOfServiceExist(service,parameters) && checkForCollectionAccess(parameters.collection)) {
        return getDBComm().then(async function(config) {
            switch (service) {
                case "getAll":
                    return getAllEntriesOfCollection(config.db,parameters).then(output => {
                        config.client.close()
                        return output;
                    })
                case "getByAttribute":
                    return findByAttribute(config.db,parameters).then(output => {
                        config.client.close()
                        return output;
                    })
                case "setAttribute":
                    return setAttributeOfObjectByQueryattribute(config.db,parameters).then(output => {
                        config.client.close()
                        return output;
                    })
                case "addDocument":
                    return insertDocument(config.db,parameters).then(output => {
                        config.client.close()
                        return output;
                    })
                case "removeDocument":
                    return removeDocument(config.db,parameters).then(output => {
                        config.client.close()
                        return output;
                    })
                case "removeAll":
                    return removeDocument(config.db,parameters).then(output => {
                        config.client.close()
                        return output
                    })
            }
        })
    }
    else{
        console.error("Service Request Failed")
        return null;
    }
}
