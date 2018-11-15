import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.newUserNotification = functions.firestore
    .document('devices/{devicesId}')
    .onCreate(async event => {
        const data = event.data();

        const tokenID = data.token;
        const userID = data.userId;

        // Notification content
        const payload = {
            notification: {
                title: 'New User',
                body: `Hello Mr.${userID}! Thanks for joining us (${tokenID})`,
                icon: 'https://goo.gl/Fz9nrQ'
            }
        }

        // ref to the device collection for the user
        const db = admin.firestore()
        const devicesRef = db.collection('devices').where('userId', '==', userID)


        // get the user's tokens and send notifications
        const devices = await devicesRef.get();

        const tokens = [];

        // send a notification to each device token
        devices.forEach(result => {
            const token = result.data().token;
            tokens.push( token )
        })

        return admin.messaging().sendToDevice(tokens, payload)

    });
