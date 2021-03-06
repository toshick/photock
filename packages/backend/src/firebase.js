const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require(path.join(
  __dirname,
  `../${process.env.SERVICEACCOUNT_JSON}`
));

const { connectStorageEmulator } = require('firebase/storage');
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  storageBucket: process.env.STORAGEBUCKET,
};
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: firebaseConfig.storageBucket,
});
const storage = getStorage();

if (process.env.IS_DEV) {
  console.log(
    '---------------------\ndevelopment mode!!!\n---------------------\n'
  );
  // storage().useEmulator('localhost', 9199);
  connectStorageEmulator(storage, 'localhost', 9199);
} else {
  console.log('---------------------\nprod mode!!!\n---------------------\n');
}

/**
 * firebaseUpload
 */
function firebaseUpload(imgpath, distpath) {
  const bucket = storage.bucket();
  return new Promise((resolve) => {
    bucket.upload(
      imgpath,
      {
        destination: distpath,
        // metadata: { contentType: mimetype },
        public: true,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
      (err, file, apiResponse) => {
        if (err) {
          resolve({ error: err.message });
          return;
        }
        if (!file) {
          console.log('エラー', apiResponse);
          resolve({ error: 'file is null' });
          return;
        }
        console.log('uploaded', file.name);
        resolve({ uploaded: file.name, url: apiResponse.mediaLink });
      }
    );
  });
}

exports.firebaseUpload = firebaseUpload;
