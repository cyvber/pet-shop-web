const express = require('express');
const router = express.Router();
const multer = require('multer');
// const {
//     uploadImage,
//     uploadLogo,
//     uploadImageMiddleware,
//     uploadLogoMiddleware,
// } = require('../controllers/uploadController');

// // Upload image route
// router.post('/image', uploadImageMiddleware, uploadImage);

// // Upload logo route
// router.post('/logo', uploadLogoMiddleware, uploadLogo);

// module.exports = router;



const uploadController = require('../controllers/uploadController');

// Middleware for handling file uploads (using multer)
const upload = multer({ dest: 'uploads/' });

router.post('/image', upload.single('product'), uploadController.uploadImage);

module.exports = router;
