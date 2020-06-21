const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();
require('dotenv').config();

const {SENDER_EMAIL, SENDER_PASSWORD} = process.env;

exports.sendEmailNotification = functions.database
  .document('messages/{docId}')
  .onWrite((snap, ctx) => {
    const data = snap.data();

    let authData = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD
      }
    });
    authData.sendMail({
        from: 'info.truly@makethatapp.com',
        to: 'osmanvalle02@gmail.com',
        subject: 'Your submission Info',
        html: `${data.html}`
      })
      .then((res) => console.log('successfully sent that mail'))
      .catch((err) => console.log(err));
  });

// const nodemailer = require('nodemailer');
// const gmailEmail = encodeURIComponent(functions.config().gmail.email);
// const gmailPassword = encodeURIComponent(functions.config().gmail.password);
// const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);
// const functions = require('firebase-functions');
//  const admin = require('firebase-admin');
// // const nodemailer = require('nodemailer');
// // const cors = require('cors')({origin: true});
//  admin.initializeApp();

//  exports.addMessage = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   const snapshot = await admin.database().ref('/messages').push({original: original});
//   // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//   res.redirect(303, snapshot.ref.toString());
// });
// exports.sendContactMessage = functions.database.ref ('/ messages / {pushKey}'). onWrite (event => {
//   const snapshot = event.data;
// // Solo envía correos electrónicos para nuevos mensajes.
//   // if (snapshot.previous.val () ||! snapshot.val (). name) {
//   //   return;
//   // }

//   const val = snapshot.val ();

//   const mailOptions = {
//     to: 'osmanvalle02@gmail.com',
//     asunto: `Solicitud de información de $ {val.html}`,
//     html: val.html
//   };
//   return mailTransport.sendMail (mailOptions) .then (() => {
//     return console.log ('Correo enviado a: test@example.com')});

// });
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const nodemailer = require('nodemailer');
// const cors = require('cors')({origin: true});
// admin.initializeApp();

// /**
// * Here we're using Gmail to send
// */
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'yourgmailaccount@gmail.com',
//         pass: 'yourgmailaccpassword'
//     }
// });

// exports.sendMail = functions.https.onRequest((req, res) => {
//     cors(req, res, () => {

//         // getting dest email by query string
//         const dest = req.query.dest;

//         const mailOptions = {
//             from: 'Your Account Name <yourgmailaccount@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
//             to: dest,
//             subject: 'I\'M A PICKLE!!!', // email subject
//             html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
//                 <br />
//                 <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
//             ` // email content in HTML
//         };

//         // returning result
//         return transporter.sendMail(mailOptions, (erro, info) => {
//             if(erro){
//                 return res.send(erro.toString());
//             }
//             return res.send('Sended');
//         });
//     });
// });
