import * as ExpressServer from "./ExpressServer/ExpressServer.js";
import * as MQTTClient from "./MQTTServer/MQTTClient.js";
import * as MQTTBroker from "./MQTTServer/MQTTBroker.js";
import Device from "./DataManagement/Sensor.js";
import {incrementWindowOpenTimerForRoomWithMac, interfaceService} from "./MongoDB/databaseManager.js";
import * as DatabaseManager from "./MongoDB/databaseManager.js";
import {initConfig} from "./Settings/config.js";


initConfig()
await ExpressServer.start()
await MQTTBroker.start()
await MQTTClient.start()

console.log("started server successfullyyyyy")

/*
let list = [
    { id: 1, name: 'Raum 1' },
    { id: 2, name: 'Raum 1A' },
    { id: 3, name: 'Raum 1B' },
    { id: 4, name: 'Raum 2' },
    { id: 5, name: 'Raum 3' },
    { id: 6, name: 'Raum 4' },
    { id: 7, name: 'Raum 6' },
    { id: 8, name: 'Raum 7' },
    { id: 9, name: 'Raum 8' },
    { id: 10, name: 'Raum 10' },
    { id: 11, name: 'Raum 11' },
    { id: 12, name: 'Raum 12' },
    { id: 13, name: 'Raum 23' },
    { id: 14, name: 'Raum 24' },
    { id: 15, name: 'Raum 25' },
    { id: 16, name: 'Raum 26' },
    { id: 17, name: 'Raum 27' },
    { id: 18, name: 'Raum 28a' },
    { id: 19, name: 'Raum 28b' },
    { id: 20, name: 'Raum 29' },
    { id: 21, name: 'Raum 30' },
    { id: 22, name: 'Raum 51' },
    { id: 23, name: 'Raum 52' },
    { id: 24, name: 'Raum 53' },
    { id: 25, name: 'Raum 54' },
    { id: 26, name: 'Raum 55' },
    { id: 27, name: 'Raum 56' },
    { id: 28, name: 'Raum 57' },
    { id: 29, name: 'Raum 58' },
    { id: 30, name: 'Raum 59' },
    { id: 31, name: 'Raum 60' },
    { id: 32, name: 'Raum 71a' },
    { id: 33, name: 'Raum 71b' },
    { id: 34, name: 'Raum 72' },
    { id: 35, name: 'Raum 74' },
    { id: 36, name: 'Raum 75' },
    { id: 37, name: 'Raum 76' },
    { id: 38, name: 'Raum 77' },
    { id: 39, name: 'Raum 78' },
    { id: 40, name: 'Raum 79' },
    { id: 41, name: 'Raum 80a' },
    { id: 42, name: 'Raum 81' },
    { id: 43, name: 'Raum 82' },
    { id: 44, name: 'Raum 83' },
    { id: 45, name: 'Raum 84' },
    { id: 46, name: 'Raum 85' },
    { id: 47, name: 'Wc(w) EG West' },
    { id: 48, name: 'Wc(m) EG Mitte' },
    { id: 49, name: 'Wc(w) EG Mitte' },
    { id: 50, name: 'Wc(m) EG Ost' },
    //1.OG rooms
    { id: 51, name: 'Raum 101' },
    { id: 52, name: 'Raum 102' },
    { id: 53, name: 'Raum 103' },
    { id: 54, name: 'Raum 104' },
    { id: 55, name: 'Raum 105' },
    { id: 56, name: 'Raum 106' },
    { id: 57, name: 'Raum 106a'},
    { id: 58, name: 'Raum 107' },
    { id: 59, name: 'Raum 108' },
    { id: 60, name: 'Raum 109' },
    { id: 61, name: 'Raum 110' },
    { id: 62, name: 'Raum 124' },
    { id: 63, name: 'Raum 125' },
    { id: 64, name: 'Raum 126' },
    { id: 65, name: 'Raum 127' },
    { id: 66, name: 'Raum 129' },
    { id: 67, name: 'Raum 130' },
    { id: 68, name: 'Raum 131' },
    { id: 69, name: 'Raum 132' },
    { id: 70, name: 'Raum 132/133' },
    { id: 71, name: 'Raum 135' },
    { id: 72, name: 'Raum 136' },
    { id: 73, name: 'Raum 137' },
    { id: 74, name: 'Raum 151' },
    { id: 75, name: 'Raum 152' },
    { id: 76, name: 'Raum 153' },
    { id: 77, name: 'Raum 154' },
    { id: 78, name: 'Raum 155' },
    { id: 79, name: 'Raum 156' },
    { id: 80, name: 'Raum 157' },
    { id: 81, name: 'Raum 158' },
    { id: 82, name: 'Raum 171' },
    { id: 83, name: 'Raum 172' },
    { id: 84, name: 'Raum 173' },
    { id: 85, name: 'Raum 174' },
    { id: 86, name: 'Raum 175' },
    { id: 87, name: 'Raum 176' },
    { id: 88, name: 'Raum 177' },
    { id: 89, name: 'Raum 178' },
    { id: 90, name: 'Raum 179' },
    { id: 91, name: 'Raum 180' },
    { id: 92, name: 'Raum 181' },
    { id: 93, name: 'Raum 182' },
    { id: 94, name: 'Raum 183' },
    { id: 95, name: 'Raum 184' },
    { id: 96, name: 'Raum 185' },
    { id: 97, name: 'Wc(m) 1OG West' },
    { id: 98, name: 'Wc(b) 1OG Mitte' },
    { id: 99, name: 'Wc(m) 1OG Mitte' },
    { id: 100, name: 'Wc(w) 1OG Mitte' },
    { id: 101, name: 'Wc(w) 1OG Ost' },
    { id: 97, name: 'Raum 282' },
    { id: 98, name: 'Raum 281' },
    { id: 99, name: 'Raum 280' },
    { id: 100, name: 'Raum 279' },
    { id: 101, name: 'Raum 278' },
    { id: 102, name: 'Raum 283' },
    { id: 103, name: 'Raum 284' },
    { id: 104, name: 'Raum 285' },
    { id: 105, name: 'Raum 271' },
    { id: 106, name: 'Raum 272' },
    { id: 107, name: 'Raum 273' },
    { id: 108, name: 'Raum 274' },
    { id: 109, name: 'Raum 277' },
    { id: 110, name: 'Raum 205' },
    { id: 111, name: 'Raum 206' },
    { id: 112, name: 'Raum 207' },
    { id: 113, name: 'Raum 208' },
    { id: 114, name: 'Raum 209' },
    { id: 115, name: 'Raum 201' },
    { id: 116, name: 'Raum 215' },
    { id: 117, name: 'Raum 214' },
    { id: 118, name: 'Raum 213' },
    { id: 119, name: 'Raum 210' },
    { id: 120, name: 'Raum 223' },
    { id: 121, name: 'Raum 224' },
    { id: 122, name: 'Wc(m) 2OG Ost' },
    { id: 123, name: 'Wc(w) 2OG Ost' }
]

let service = "addDocument"
for(let r of list) {
    let room = {
        name : r.name,
        device : null
    }
    await DatabaseManager.interfaceService(service, {
        collection : "rooms",
        update : room
    }).then(res => console.log(res))
}

 */

