import * as DatabaseManager from "../MongoDB/databaseManager.js";
import {serverconfig} from "../Settings/config.js";


async function cleanHistoryData() {
    await DatabaseManager.interfaceService("removeAll",{
        collection : "data",
        query : {
            timestamp: { $lte : (Date.now() - (serverconfig.database.deleteDataAfterDays * 24 * 60 * 60 * 1000))}
        }
    })
}

export async function updateHistoryData(device) {
    await DatabaseManager.interfaceService("addDocument",{
        collection : "data",
        update : {
            mac : device.config.mac,
            battery : device.config.battery,
            heater : device.config.temperature.heater,
            window : device.config.temperature.window,
            timestamp : Date.now()
        }
    })
    await cleanHistoryData()
}

async function checkDeviceAvailabilty(device) {

}
