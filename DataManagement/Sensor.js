import * as DatabaseManager from "../MongoDB/databaseManager.js";
import {incrementWindowOpenTimerForRoomWithMac} from "../MongoDB/databaseManager.js";
import {serverconfig} from "../Settings/config.js";

const temperatureConversionSlope = 1
const isAvailableOffset = 3600


function convertTemperature(temperatureRaw) {
    return temperatureRaw * temperatureConversionSlope;
}

export default class Device{
    constructor(mac) {
        this.isNew = true
        this.databaseChecked = false
        this.config = {
            mac: mac,
            name: "testlokus",
            wakeup: 300,
            triggered: false,
            battery : 0.0,
            temperature: {
                heater: 0.0,
                window: 0.0
            },
            last_updated: Date.now(),
            trigger_removed: Date.now()
        }

    }

    convertBattery(batteryRaw) {
        let adcVoltage = batteryRaw * (serverconfig.sensorconfig.maximumBatteryVoltage / serverconfig.sensorconfig.batteryAdcResolution)
        let voltageOffset = adcVoltage - serverconfig.sensorconfig.minimumBatteryVoltage
        let maximumVoltageOffset = serverconfig.sensorconfig.maximumBatteryVoltage-serverconfig.sensorconfig.minimumBatteryVoltage
        this.config.battery = (Math.round(((voltageOffset / maximumVoltageOffset) * 100)) / 100).toFixed(2)
        return this.config.battery
    }

    getInterval() {
        return this.config.wakeup || serverconfig.sensorconfig.wakeupStandardValue
    }

    isTriggered() {
        let window = this.config.temperature.window
        let heater = this.config.temperature.heater
        let lastRemoved = this.config.trigger_removed

        let diff = heater - window;
        let temperatureIsTriggerReason = diff > serverconfig.sensorconfig.temperatureDiffThreshold
        console.log(`Temperature Difference for Sensor ${this.config.mac} is ${temperatureIsTriggerReason}`)
        let timeTriggerDiff = Date.now() - lastRemoved;
        let timeSinceLastTriggeredIsOver = timeTriggerDiff > serverconfig.sensorconfig.timeTriggerRemovedThreshold_ms
        console.log(`Time Trigger for Sensor ${this.config.mac} is ${timeSinceLastTriggeredIsOver}`)
        this.config.triggered = temperatureIsTriggerReason && timeSinceLastTriggeredIsOver
        return this.config.triggered
    }

    batteryIsEmpty() {
        return this.config.battery <= serverconfig.sensorconfig.batteryEmptyLimit;
    }

    deviceIsAvailable() {
        return (this.config.last_updated/1000 + this.config.wakeup + isAvailableOffset) < (Date.now()/1000)
    }

    async checkWithDatabase(force) {
        if(!this.databaseChecked || force) {
            let device = await DatabaseManager.getDevice(this.config.mac);
            this.databaseChecked = true
            if(device != null) {
                this.isNew = false
                this.config = device
            }
        }
    }

    async update(data) {
        console.log("Updating Sensor Database entry: ")
        console.log(data)
        await this.checkWithDatabase(false)
        this.convertBattery(data.battery);
        this.config.temperature.heater = data.heater
        this.config.temperature.window = data.room
        this.isTriggered()
        if(this.config.triggered) {
            await incrementWindowOpenTimerForRoomWithMac(data.mac,this.config.last_updated)
        }
        this.config.last_updated = Date.now()
        let service = this.isNew ? "addDocument" : "setAttribute"
        let response = await DatabaseManager.interfaceService(service, {
            collection : "devices",
            query : {
                mac : data.mac
            },
            update : this.config
        })

        if(response != null){
            console.log("Successfully updated Database Entry for Device with mac ", this.config.mac)
        }
        else{
            console.error("Failed updating the Database Entry for Device with mac ", this.config.mac)
        }



    }
}
