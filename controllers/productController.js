const Product = require("../models/productModel")
const multer = require("multer")



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');  // Store uploaded files in 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);  // Save with unique name
    }
  });
  
  // Define allowed file types
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);  // Accept images
    } else {
      cb(null, false);  // Reject non-images
    }
  };

const createProduct = async (req, res) => {
    try {
    const {name, price, description, category, stock, rating } = req.body
    
        if(!name|| !price || !description || !image || !images || !category || !stock ||!rating ){
            res.status(404).json({
                status: false,
                message: "please provide required details"
            })
        
        }

          // Handle image and images upload
    const image = req.file ? req.file.path : null;
    const images = req.files ? req.files.map(file => file.path) : [];


        const product = new product({
            name,
            price,
            description,
            image,
            images,
            category,
            stock,
            rating
        })

        await product.save()

        res.status(201).json({
            status: true,
            message: "product created successfully",
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.massage
        })
    }


}

// const getAllProducts = async () => {
//     try {
//         const products = await Product.find()
//     } catch (error) {
        
//     }
// }

module.exports = {
    createProduct,
}
export const upload = multer({ storage, fileFilter });