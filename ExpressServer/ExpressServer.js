import Express from "express"


import * as dbManager from "../MongoDB/databaseManager.js";
import {serverconfig} from "../Settings/config.js";
import {registerPushToken} from "../Authentification/ExpoPush.js";
import {loginAsAdmin, tokenIsValid} from "../Authentification/Authentification.js";
import child_process from "child_process"

export {start}

const app = Express()

app.use(Express.json());
app.use(Express.urlencoded({extended :true}))

function tokenCheck(req,res,next) {
    console.log(req.body)
    tokenIsValid(req.body.id).then(isValid => {
        if(isValid) {
            next();
        }
        else{
            res.sendStatus(400)
        }
    })

}

app.get("/updateServer/:password",(req,res)=>{
    if(req.params.password === "4j8f4hg9w4hg84wghw98fhnbreughw4r80gh97ugh0ghrtughrti0grsnbg9urhg80hg54") {
        //shell.exec('../Deployment/deployment.sh')
        res.send("deployment")
        let myShellScript = child_process.exec('sh ./Deployment/deployment.sh');
        myShellScript.stdout.on('data', (data)=>{
            console.log(data);
            // do whatever you want here with data
        });
        myShellScript.stderr.on('data', (data)=>{
            console.error(data);
        });

    }
})

app.get("/getDevices",(req,res) => {
    dbManager.getAvailableDevices().then(response => {
        res.json(response)
    })
})

app.get("/getDeviceData/:mac/:lowertimestamp/:uppertimestamp",(req,res)  => {
    dbManager.getDeviceData(req.params.mac,req.params["lowertimestamp"],req.params["uppertimestamp"]).then(response => {
        res.json(response)
    })
})

app.put("/setIntervalForAllDevices",tokenCheck,(req,res)=>{
    dbManager.setIntervalForAllDevices(req.body.interval).then(response => {
        res.json(response)
    })
})

app.get("/getRooms",(req,res) => {
    dbManager.getAvailableRooms().then(response => {
        res.json(response)
    })
})

app.get("/getTriggeredRooms",(req,res) => {
    dbManager.getTriggeredRooms().then(response => {
        res.json(response)
    })
})

app.get("/getDeviceByRoom/:room",(req,res) => {
    dbManager.getDeviceByRoom(req.params.room).then(response => {
        res.json(response)
    })
})

app.get("/getDevice/:mac",(req,res) => {
    dbManager.getDevice(req.params.mac).then(response => {
        res.json(response)
    })
})

app.put("/addDeviceToRoom",tokenCheck,(req,res) => {
    dbManager.addDeviceToRoom(req.body.mac,req.body.room).then(response => {
        res.json(response)
    })
})

app.put("/setIntervalForDevice",tokenCheck,(req,res)=>{
    dbManager.setIntervalForDevice(req.body.mac,req.body.interval).then(response => {
        res.json(response)
    })
})

app.delete("/removeDeviceFromRoom",tokenCheck,(req,res) => {
    dbManager.removeDeviceFromRoom(req.body.room).then(response => {
        res.json(response)
    })
})

app.delete("/removeAlertFromRoom",tokenCheck,(req,res) => {
    dbManager.removeAlertFromRoom(req.body.room).then(response => {
        res.json(response)
    })
})

app.delete("/removeAlertFromDevice",tokenCheck,(req,res) => {
    dbManager.removeAlertFromDevice(req.body.mac).then(response => {
        res.json(response)
    })
})

app.put("/registerPushToken",(req,res) => {
    registerPushToken(req.body.token).then(response => {
        if(response === null) {
            res.sendStatus(500)
        }
        res.json(response)
    })
})

app.get("/loginAsAdmin/:hash",(req,res) => {
    loginAsAdmin(req.params.hash).then(response => {
        if(response === null) {
            res.sendStatus(400)
        }
        else{
            res.json(response)
        }
    })
})


app.get("/getAllDevicesWithRoom",(req,res) => {
    dbManager.getAvailableDevicesWithRoom().then(response => {
        res.json(response)
    })
})

app.get("/getRoomByMac/:room",(req,res) => {
    dbManager.getRoomByMac.then(response => {
        res.json(response)
    })
})



async function start() {
    const PORT = process.env.PORT || serverconfig.express.port; //for google 8080
    await app.listen(PORT)
    console.log(`Server listening on port ${PORT}...`);
}
