const admin = require("firebase-admin");
const serviceAccount = require("../../firebase-service-account.json");
const cloudinary = require("cloudinary").v2;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "stake-automation.firebasestorage.app" // EXACT NAME
});

const bucket = admin.storage().bucket();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  admin,
  bucket,
  cloudinary
};
