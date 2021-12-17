import {getService} from "./databaseCommunication.js";

export {incrementWindowOpenTimerForRoomWithMac,setIntervalForAllDevices,deviceExists,getRoomByMac,getAvailableDevicesWithRoom,getDeviceData,getTriggeredRooms,getAvailableRooms,interfaceService,removeAlertFromDevice,removeAlertFromRoom,removeDeviceFromRoom,getAvailableDevices,getDevice,getDeviceByRoom,addDeviceToRoom,setIntervalForDevice}



/*
Für Fehlerauswertung
 */
async function interfaceService(service,parameters) {
    let response = await getService(service,parameters)
    if(response === null) {
        console.error(`Could not access Collection or Service`)
        return null
    }
    if(response.length === 0) {
        //console.error(`Could not query`)
        return null
    }
    return response;
}

async function getAvailableDevices() {
    return await interfaceService("getAll", {
        collection : "devices"
    })
}

async function getRoomByMac(mac) {
    return await interfaceService("getByAttribute",{
        collection : "rooms",
        query : {
            device : mac
        }
    })
}

async function getDeviceWithRoom(mac) {
    let device = await getDevice(mac)
    if(device === null) {
        return null
    }
    let room = await getRoomByMac(mac)
    if(room === null) {
        device["room"] = null
    }
    else{
        device["room"] = (room[0]["name"])
    }
    return device
}

async function getAvailableDevicesWithRoom() {
    let devices = await getAvailableDevices()
    for(let device of devices) {
        let room = await getRoomByMac(device.mac)
        if(room === null) {
            device["room"] = null
        }
        else{
            device["room"] = (room[0]["name"])
        }
    }
    return devices
}

async function getTriggeredRooms() {
    let rooms = await interfaceService("getAll", {
        collection : "rooms"
    })
    let triggeredRooms = []
    for(let room of rooms) {
        let device = await interfaceService("getByAttribute",{
            collection : "devices",
            query : {
                mac : room.device
            }

        })

        if(device[0]["triggered"]) {
            triggeredRooms.push(room)
        }
    }
    return triggeredRooms
}

async function getDeviceData(mac,lowertimestamp,uppertimestamp) {
    let data = await interfaceService("getByAttribute",{
        collection : "data",
        query : {
                mac : mac,
                timestamp : {$gte : parseInt(lowertimestamp),$lte : parseInt(uppertimestamp)}

        }
    })
    if(data === null) {
         return []
    }
    return data
}


async function getAvailableRooms() {

    return await interfaceService("getAll",{
        collection :"rooms"
    })
}

async function getDevice(mac) {
    let device = await interfaceService("getByAttribute",{
        collection : "devices",
        query : {
            mac : mac
        }
    })
    if(device) {
        device = device[0]
        delete device["_id"]
        return device
    }
    return null
}

async function getRoom(roomname) {
    let room = await interfaceService("getByAttribute",{
        collection : "rooms",
        query : {
            name : roomname
        }
    })
    if(room) {
        room = room[0]
        delete room["_id"]
        return room
    }
    return null
}

async function getDeviceByRoom(roomname) {
    let room = await getRoom(roomname)
    let mac = room["device"]
    return await getDevice(mac)
}


async function deviceExists(mac) {
    let device = await getDevice(mac)
    return device !== null
}

async function deviceExistsAndHasRoom(mac) {
    let device = await getDeviceWithRoom(mac)
    return device !== null && device["room"] === null
}

async function addDeviceToRoom(mac,roomname) {
    let deviceEx = await deviceExistsAndHasRoom(mac)
    console.log(deviceEx)
    if(deviceEx) {
        return await interfaceService("setAttribute", {
            collection: "rooms",
            query: {
                name : roomname
            },
            update : {
                device : mac
            }
        })
    }
    else{
        return null
    }

}

async function setIntervalForAllDevices(interval) {
    let  devices = await getAvailableDevices()
    let devicesUpdated =  []
    for(let device of devices)  {
        if(interval !== device.wakeup) {
            let updatedDevice = await setIntervalForDevice(device.mac, interval)
            console.log(updatedDevice)
            devicesUpdated.push(updatedDevice[0])
        }
    }
    return devicesUpdated
}

async function setIntervalForDevice(mac,interval) {
    return await interfaceService("setAttribute", {
        collection: "devices",
        query : {
            mac : mac
        },
        update : {
            wakeup : interval
        }
    })
}

async function removeDeviceFromRoom(roomname) {
    return await interfaceService("setAttribute", {
        collection: "rooms",
        query: {
            name : roomname
        },
        update : {
            device : null
        }
    })
}

async function removeAlertFromDevice(mac) {
    let device = await interfaceService("setAttribute", {
        collection: "devices",
        query: {
            mac : mac
        },
        update : {
            triggered : false,
            trigger_removed : Date.now()
        }
    })
    return device[0]
}

async function removeAlertFromRoom(roomname) {
    let room = await getRoom(roomname)
    let mac = room["device"]
    return removeAlertFromDevice(mac)
}

async function incrementWindowOpenTimerForRoomWithMac(mac,lastUpdated) {
    let rooms = await getRoomByMac(mac)
    if(rooms !== null) {
        let doc = rooms[0]
        let cummulativeTime = (doc["cummulativeIsTriggeredTime"] === undefined || doc["cummulativeIsTriggeredTime"] === null) ? 0 : doc["cummulativeIsTriggeredTime"]
        let cummulativeIsTriggeredTime = cummulativeTime  + (Date.now() - lastUpdated)
        let room = await interfaceService("setAttribute", {
            collection: "rooms",
            query: {
                name : doc["name"]
            },
            update : {
                cummulativeIsTriggeredTime : cummulativeIsTriggeredTime
            }
        })
    }
}


