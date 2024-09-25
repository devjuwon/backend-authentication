// all user endpoints will be defined here
const express = require("express")
const { registerUser, registerAdmin, loginUser, loginAdmin, forgotPassword, resetPassword, getAllUsers, getSingleUser, updateUserProfile, updateAdminProfile, getAllAdmins } = require("../controllers/userController")
const { protect, admin } = require("../middleware/auth")

const router = express.Router()

// user route 
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/forgot-password", forgotPassword)
router.put("/reset-password/:resetToken", resetPassword)
router.put("/users/:id", updateUserProfile)



// admin route
router.post("/register/admin", registerAdmin)
router.post("/login/admin", loginAdmin)
router.get("/get-all-users/users", protect, admin, getAllUsers)
router.get("/get-all-admins/admin", getAllAdmins)


router.get('/users/:id', protect, getSingleUser)
router.put('/admins/:id', protect, admin, updateAdminProfile)



 








module.exports = router