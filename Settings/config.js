import {interfaceService} from "../MongoDB/databaseManager.js";

let serverconfig = {
    "mqtt" : {
        "topics" : {
            "Sensordata" : "topic/data",
            "Intervaldata" : "/interval"
        },
        "address": "141.41.32.228",
        "port" : 1883
    },
    "express" : {
        "port" : 8000
    },
    "authorization" : {
        "saltValidityDuration" : 24000
    },
    "sensorconfig" : {
        "temperatureDiffThreshold" : 5,
        "timeTriggerRemovedThreshold_ms" : 3600000,
        "minimumBatteryVoltage" : 2.8,
        "maximumBatteryVoltage" : 4.2,
        "batteryAdcResolution" : 1000,
        "batteryEmptyLimit" : 0.2,
        "wakeupStandardValue" : 600
    }
}

function updateServerConfig() {
    console.log("updating server config")
    interfaceService("getAll",{
        collection : "config"
    }).then(result => {
        if(result === null || result.length < 0) {
            interfaceService("addDocument",{
                collection : "config",
                update : serverconfig
            }).then(r => console.log(r))
        }
        else{
            serverconfig = result[0]
        }
    })
}

function initConfig() {
    //updateServerConfig()
    //setInterval(updateServerConfig,5000)
    console.log("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
}

export {serverconfig,initConfig}
