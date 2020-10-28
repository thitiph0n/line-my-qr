const { firebase } = require('../helpers/firebase');

module.exports.uploadQR = async (imgPath) => {
  const bucket = firebase.storage().bucket();

  try {
    const upload = await bucket.upload(imgPath, {
      public: true,
    });

    return { result: upload[1], error: null };
  } catch (error) {
    return { error: error.message };
  }
};
