const admin = require('firebase-admin');

const serviceAccount = require('../../line-my-qr-firebase-adminsdk-jmtxo-1cf84ba96b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://line-my-qr.firebaseio.com',
  storageBucket: 'line-my-qr.appspot.com',
});

module.exports.firebase = admin;
