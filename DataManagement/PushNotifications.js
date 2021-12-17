import {getRoomByMac} from "../MongoDB/databaseManager.js";
import {sendNotifcationToAllDevices} from "../Authentification/ExpoPush.js";

export async function sendDeviceTriggerNotification(device) {
    let room = await getRoomByMac(device.config.mac)
    let title = "Device was triggered"
    let body
    if(room != null) {
        body = `A window in room ${room["name"]} is open. Heater: ${device.config.temperature.heater} Window: ${device.config.temperature.window}`
    }
    else{
        body = `The device with the mac address ${device.config.mac} was triggered. This device has not been assigned to a room yet.`
    }
    sendNotifcationToAllDevices(body,title)
}

export async function sendBatteryEmptyNotification(device) {
    let room = await getRoomByMac(device.config.mac)
    let title = "Device battery is about to die"
    let body
    if(room !== null && room !== undefined) {
        body = `The battery of the device in room ${room["name"]} is about to die: ${device.config.battery * 100}%`
    }
    else{
        body = `The battery of the device with the mac address ${device.config.mac} is about to die:  ${device.config.battery * 100}%. This device has not been assigned to a room yet.`
    }
    sendNotifcationToAllDevices(body,title)
}

export function sendNewDeviceAvailableNotification(device) {
    let title = "A new device was discovered"
    let body = `A new device was discovered: ${device.config.mac}`
    sendNotifcationToAllDevices(body,title)
}

export function sendDeviceNotAvailableNotification(device) {
    let title = "Cannot communicate with device"
    let body = `The device ${device.config.mac} seems to have a problem, as it did not wake up from the dead anymore.`
    sendNotifcationToAllDevices(body,title)
}
