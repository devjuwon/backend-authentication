const express = require("express")
const { createProduct } = require("../controllers/productController")

const router = express.Router()

router.post('/products', upload.fields([
    { name: 'image', maxCount: 1 },  // Single image
    { name: 'images', maxCount: 10 }  // Multiple images
  ]), createProduct);








module.exports = router