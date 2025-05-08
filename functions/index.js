const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // تحقق من الـ data سواء كان مباشر أو متغلف
  const uid = data.uid || (data.data && data.data.uid);
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'UID is required');
  }

  try {
    const user = await admin.auth().getUser(uid);
    console.log('User found:', user.uid, 'Current claims:', user.customClaims);

    await admin.auth().setCustomUserClaims(uid, { admin: true });

    const updatedUser = await admin.auth().getUser(uid);
    console.log('Updated claims:', updatedUser.customClaims);

    return {
      message: `Admin claim set for user ${uid}`,
      claims: updatedUser.customClaims,
    };
  } catch (error) {
    console.error('Detailed error:', error);
    throw new functions.https.HttpsError('internal', 'Error setting claim: ' + error.message);
  }
});