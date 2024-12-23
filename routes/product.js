// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const {uploadProduct} = require('../controller/product'); 



const router = express();

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });




// Define the route for uploading products
router.post('/uploadProduct', upload.single('image'), uploadProduct);

module.exports = router;