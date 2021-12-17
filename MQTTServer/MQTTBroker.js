import {serverconfig} from "../Settings/config.js";
export {start}
import aedes from "aedes"
import net from "net"
const aedesServer = aedes()
const server = net.createServer(aedesServer.handle)
const port = serverconfig.mqtt.port

async function start() {
    await server.listen(port)
    console.log('MQTT server started and listening on port ', port)
}
