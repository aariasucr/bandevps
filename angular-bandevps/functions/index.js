const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'theironbank.cr@gmail.com',
    pass: '1r0n_B4NK'
  }
});

exports.sendMail = functions.database
  .ref('/messages/{userId}/{messageId}')
  .onCreate((snapshot, context) => {
    // const val = snapshot.val();
    // console.log('snapshot', snapshot);
    // console.log('context params', context.params);

    const userRef = snapshot.ref.parent.parent.parent.child(`users/${context.params.userId}`);

    userRef
      .once('value')
      .then((result) => {
        console.log('result', result);
        if (!!result && !!result.val() && 'email' in result.val() && 'fullName' in result.val()) {
          const email = result.val().email;
          const fullName = result.val().fullName;

          const mailOptions = {
            from: 'noreply <noreply@bandevps.firebaseapp.com>', // You can write any mail Adress you want this doesn't effect anything
            to: `${email}`, // This mail adress should be filled with any mail you want to read it
            subject: 'Solicitud recibida', // Sample Subject for you template
            html: `<body style="margin: 0; padding: 0;">
            <p>Estimado(a) ${fullName}:</p>
            <p>Hemos recibido su solicitud. Nuestros agentes se pondrán en contacto con usted para continuar con el proceso.</p>
            <p>El número de comprobante de la solicitud es ${context.params.messageId}.</p>
            <p>Gracias.</p>
            <p>El equipo de The Iron Bank</p>
          </body>
              ` // email content in HTML. You can write any Html template in here
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return console.log(error);
            }
            console.log('Message sent: ' + info.response);
          });
        } else {
          return;
        }
      })
      .catch((error) => {
        return console.log(error);
      });
  });
