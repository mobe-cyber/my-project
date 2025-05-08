const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const userUid = ZiGhlJuWU1Qubp4OSUtHYavf0tv1; // استبدل ده بـ UID بتاع المستخدم

admin
  .auth()
  .setCustomUserClaims(userUid, { admin: true })
  .then(() => {
    console.log('Custom Claim "admin: true" added successfully!');
  })
  .catch((error) => {
    console.error('Error setting custom claim:', error);
  });