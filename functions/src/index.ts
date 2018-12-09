import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// exports.newUserNotification = functions.firestore
//     .document('devices/{devicesId}')
//     .onCreate(async event => {
//         const data = event.data();

//         const tokenID = data.token;
//         const userID = data.userId;

//         // Notification content
//         const payload = {
//             notification: {
//                 title: 'New User',
//                 body: `Hello Mr.${userID}! Thanks for joining us (${tokenID})`,
//                 icon: 'https://goo.gl/Fz9nrQ'
//             }
//         }

//         // ref to the device collection for the user
//         const db = admin.firestore()
//         const devicesRef = db.collection('devices').where('userId', '==', userID)


//         // get the user's tokens and send notifications
//         const devices = await devicesRef.get();

//         const tokens = [];

//         // send a notification to each device token
//         devices.forEach(result => {
//             const token = result.data().token;
//             tokens.push( token )
//         })

//         return admin.messaging().sendToDevice(tokens, payload)

//     });

exports.newUserNotification = functions.firestore
.document('users/{usersId}')
.onCreate(async event => {
    const data = event.data();

    const tokenID = data.deviceID;

    // Notification content
    const payload = {
        notification: {
            title: 'New User',
            body: `Hello Mr.${data.username}! Thanks for joining us (${tokenID})`,
            icon: 'https://goo.gl/Fz9nrQ'
        }
    }

    return admin.messaging().sendToDevice(tokenID, payload)
        .then((success) => {
            console.log("success notification" + success.results);
        })
        .catch((fail) => {
            console.log("failed notification" + fail.results);
        });
});

exports.updateToken = functions.firestore
.document('users/{usersId}')
.onUpdate(async event => {
    const dataBefore = event.before.data();
    const dataAfter = event.after.data();

    // Notification content
    const payload = {
        notification: {
            title: 'Update Token',
            body: `Your token has been updated to (${dataAfter.deviceID})`,
        }
    }

    // const tokens = [];

    // tokens.push( dataAfter.deviceID)

    console.log(`Device id : ${dataAfter.deviceID}`);

    return admin.messaging().sendToDevice(dataAfter.deviceID, payload)
        .then((success) => {
            console.log("success notification" + success.results);
        })
        .catch((fail) => {
            console.log("failed notification" + fail.results);
        });

});
