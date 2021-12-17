import { Expo } from 'expo-server-sdk';
import {interfaceService} from "../MongoDB/databaseManager.js";
import {getService} from "../MongoDB/databaseCommunication.js";

export {registerPushToken,sendNotifcationToAllDevices}

let expo = new Expo();

async function tokenExists(token)  {
    let tokenExistsResponse = await interfaceService("getByAttribute",{
        collection : "pushtokens",
        query : {
            token : token
        }
    })
    return tokenExistsResponse !== null
}


async function registerPushToken(token) {
    if(! await tokenExists(token)) {
        let response = await interfaceService("addDocument" ,{
            collection : "pushtokens",
            update : {
                token : token
            }
        })
        if(response == null) {
            console.error("Failed registering Push Token: ", token)
            return null
        }
    }
    else{
        console.log("Token already exists: ",token)
    }
    return {
        response : "ok"
    }
}

async function unregisterPushToken(token) {
    if(await tokenExists(token)) {
        let response = await getService("removeDocument",{
            collection : "pushtokens",
            query : {
                token : token
            }
        })
        if(response) {
            console.log("Succesfully unregistered PushToken: ",token)
        }
        else{
            console.log("Failed unregistering PushToken: ",token)
        }

    }
}

function sendNotifcationToAllDevices(body,title) {
    console.log("Sending Push notification: ", body,title)
    interfaceService("getAll", {
        collection : "pushtokens"
    }).then(response => {
        if(response != null) {
            let messageToToken = []
            for(let token of response) {
                messageToToken.push({
                    title: title,
                    body: body,
                    token: token.token
                })
            }
            pushAllMessages(messageToToken).then(pushResponse => {
                if(pushResponse) {
                    console.log(pushResponse)
                }
            })
        }
    })
}

async function pushAllMessages(messageToToken) {
// Create the messages that you want to send to clients
    let messages = [];
    for (let pushTokenConfig of messageToToken) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushTokenConfig.token)) {
            console.error(`Push token ${pushTokenConfig.token} is not a valid Expo push token`);
            continue;
        }

        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        messages.push({
            to: pushTokenConfig.token,
            sound: 'default',
            body: pushTokenConfig.body,
            title: pushTokenConfig.title,
        })
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }
    for (let ticket of tickets) {
        if(ticket.status === "error") {
            if(ticket.details.error === "DeviceNotRegistered") {
                let pushTokenToUnregister = ticket.message.substring(
                    1,
                    ticket.message.lastIndexOf('"')
                );
                await unregisterPushToken(pushTokenToUnregister)
            }
        }
    }
}
