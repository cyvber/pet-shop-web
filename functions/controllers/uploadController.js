// uploadController.js

const { storage } = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase Admin SDK
const admin = require('firebase-admin');
admin.initializeApp();

// Function to upload an image to Firebase Storage
exports.uploadImage = async (req, res) => {
  try {
    // Get the image file from the request
    const file = req.file;

    // Generate a unique file name using UUID
    const fileName = `${uuidv4()}-${file.originalname}`;

    // Create a reference to the Firebase Storage bucket
    const bucket = storage().bucket();
    const fileRef = bucket.file(fileName);

    // Upload the image to Firebase Storage
    await fileRef.save(file.buffer);

    // Get the public URL of the uploaded image
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}?alt=media`;

    // Send the image URL back to the frontend
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};


// const multer = require('multer');
// const path = require('path');
// const admin = require('firebase-admin');
// const { v4: uuidv4 } = require('uuid');

// // Initialize Firebase Admin
// admin.initializeApp({
//   storageBucket: "pet-shop-web-app.firebasestorage.app", // Replace with your bucket name
// });
// const bucket = admin.storage().bucket();
// console.log("Bucket Name:", bucket.name);

// // Set up Multer for memory storage (no disk storage needed)
// const upload = multer({
//     storage: multer.memoryStorage(), // In-memory storage for Firebase
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   });

// // Upload image to Firebase Storage
// exports.uploadImage = async (req, res) => {
//     console.log("Headers:", req.headers);
//     console.log("Body:", req.body);
//     console.log("File:", req.file);
//   if (!req.file) {
//     console.error("No file detected in the request.");
//   return res.status(400).json({ success: 0, message: "No file provided" });
//   }

//   try {
//     const file = req.file;
//     const filename = `images/${Date.now()}_${uuidv4()}_${file.originalname}`;
//     const fileUpload = bucket.file(filename);

//     const uuid = uuidv4(); // Generate a unique token for public access
//     await fileUpload.save(file.buffer, {
//       metadata: {
//         contentType: file.mimetype,
//         metadata: {
//           firebaseStorageDownloadTokens: uuid,
//         },
//       },
//     });

//     // Generate public URL
//     const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
//       filename
//     )}?alt=media&token=${uuid}`;

//     res.json({
//       success: 1,
//       image_url: publicUrl,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: 0, message: "Image upload failed", error });
//   }
// };

// // Upload logo to Firebase Storage
// exports.uploadLogo = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ success: 0, message: "No logo file provided" });
//   }

//   try {
//     const file = req.file;
//     const filename = `logos/${Date.now()}_${file.originalname}`;
//     const fileUpload = bucket.file(filename);

//     const uuid = uuidv4();
//     await fileUpload.save(file.buffer, {
//       metadata: {
//         contentType: file.mimetype,
//         metadata: {
//           firebaseStorageDownloadTokens: uuid,
//         },
//       },
//     });

//     // Generate public URL
//     const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
//       filename
//     )}?alt=media&token=${uuid}`;

//     res.json({
//       success: 1,
//       logo_url: publicUrl,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: 0, message: "Logo upload failed", error });
//   }
// };

// // Multer middlewares
// exports.uploadImageMiddleware = upload.single('product');
// exports.uploadLogoMiddleware = upload.single('logo');



// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Image storage engine
// const imageStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const dir = path.join(__dirname, '../upload/images');
//         if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // Ensure directory exists
//         cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//     },
// });
// const uploadImage = multer({ storage: imageStorage });

// // Logo storage engine
// const logoStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const dir = path.join(__dirname, '../upload/logos');
//         if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // Ensure directory exists
//         cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//     },
// });
// const uploadLogo = multer({ storage: logoStorage });
// const baseUrl = `${process.env.API_URL}`;
// //const localUrl = `http://localhost:${process.env.PORT}`;

// // Upload image handler
// exports.uploadImage = (req, res) => {
//     res.json({
//         success: 1,
//         image_url: `${baseUrl}/images/${req.file.filename}`,
//     });
// };

// // Upload logo handler
// exports.uploadLogo = (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ success: 0, message: 'Logo upload failed.' });
//     }
//     res.json({
//         success: 1,
//         logo_url: `${baseUrl}/logos/${req.file.filename}`,
//     });
// };


// // Multer middlewares
// exports.uploadImageMiddleware = uploadImage.single('product');
// exports.uploadLogoMiddleware = uploadLogo.single('logo');
