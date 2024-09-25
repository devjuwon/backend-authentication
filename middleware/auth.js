const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password")

            if(!req.user){
                return res.status(401).json({
                    message: "Not authorised, user not found",
                    status:"failed",
                    error: "invalid token"
                })
            } 
            next()


        } catch (error) {
            return res.status(401).json({
                message: "Not authorised, invalid token",
                status: "failed",
                error: error.message
            })
        }
    }else{
        return res.status(401).json({
            message: "Not authorised, invalid token",
            status: "failed",
            
        })
    }
}


const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    }else {
        return res.status(403).json({
            message: "not authorised as an admin",

        })
    }
}


module.exports = { protect, admin };
