import {serverconfig} from "../Settings/config.js";
import Device from "../DataManagement/Sensor.js"
import * as DatabaseManager from "../MongoDB/databaseManager.js"
export {start}

import mqtt from "mqtt"
import * as PushNotifications from "../DataManagement/PushNotifications.js";
import {updateHistoryData} from "../DataManagement/HistoryDataManagement.js";
const topicToSubscribe = serverconfig.mqtt.topics.Sensordata
const topicToPublish = serverconfig.mqtt.topics.Intervaldata

function start() {
    console.log(`mqtt://${serverconfig.mqtt.address}:${serverconfig.mqtt.port}`)
    const client = mqtt.connect(`mqtt://${serverconfig.mqtt.address}:${serverconfig.mqtt.port}`)
    client.on("connect",function () {
        console.log("Client has Subscribed to topic",topicToSubscribe);
        client.subscribe(topicToSubscribe)
    })

    client.on("error",function(error) {
        console.error(error)
    })

    client.on("message",async function(topic,message) {
        let msg = message.toString()
        console.log(`received topic ${topic} and message ${msg}`)
        if(topic === topicToSubscribe) {
            console.log("Received Message From Sensor: ",msg)
            let data = JSON.parse(msg)
            if(data !== null) {
                console.log("Received Message from Sensor with Mac: ",)
                let device = new Device(data.mac)
                await device.checkWithDatabase(true)
                client.publish(data.mac + topicToPublish, device.getInterval().toString())
                await device.update(data)
                await updateHistoryData(device)
                if(device.isTriggered()) {
                    await PushNotifications.sendDeviceTriggerNotification(device)
                }
                if(device.batteryIsEmpty()) {
                    await PushNotifications.sendBatteryEmptyNotification(device)
                }
            }
            else{
                console.error("Received Sensor Info had wrong format ", message)
            }
        }
    })
}
