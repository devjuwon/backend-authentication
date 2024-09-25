// importing express
const express = require("express")

// initializing express and storing it in a variable called app
const app = express()

// port
require("dotenv").config()
const PORT = process.env.PORT || 5000

// import database connection
const connectDB = require("./db/db")

// execute database connection
connectDB()

// import user route
const userRoute = require("./routes/userRoutes")

// import product route
const productRoute = require("./routes/productRoutes")









// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))





// using the user route
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)











// testing general route
app.get("/api", (req, res) => {
    res.json({message: "welcome to my server"})
})




// listen for request
app.listen(PORT, () => {
    console.log("server started sucessfully");
    
})