// all functions that users can execute
const User = require("../models/userModel");
const crypto = require("crypto");
const generateToken = require('../utils/generateToken')
const sendMail = require("../utils/sendMail")

// register user controller
const registerUser = async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: "User already exist" });
  }

  const user = await User.create({
    fullName,
    email,
    phone,
    password,
  });
  if (user) {
    return res.status(201).json({ message: "user registered successfully" });
  } else {
    res.status(400).json({ error: "invalid user data" });
  }
};

// register admin controller
const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      isAdmin: true,
    });

    if (user) {
        return res.status(201).json({ message: "admin registered successfully" });
      }
  } catch (error) {
    res.status(400).json({ error: "invalid user data" });
  }
};

// login user controller
const loginUser =async (req, res) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    
    if (userExists && (await userExists.matchPassword(password))) {
        const token = generateToken(userExists._id)
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "user loggedin successfully",
            userExists,
            token
        });
    } else{
        res.status(401).json({error: "invalid email or password"})
    }
}

// login admin controller
const loginAdmin =async (req, res) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    
    if (userExists && (await userExists.matchPassword(password))) {
        const token = generateToken(userExists._id)
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "admin loggedin successfully",
            userExists,
            token
        });
    } else{
        res.status(401).json({error: "invalid email or password"})
    }
}


// forgot password controller
const forgotPassword = async (req, res) => {
    const {email} = req.body
    const user = await User.findOne({email})

    if(!user){
        res.status(401)
        throw new Error("User not found")
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000 // 10 days

    await user.save()

    const resetUrl = `${req.protocol}://${req.get("host")}/api/users/reset-password/${resetToken}`

    const message = `You are receiving this email because you or someone else have requested the reset 
                of a password. Please click the following link to reset your password: \n\n ${resetUrl}`

    await sendMail({
        email: user.email,
        subject: "PASSWORD RESET TOKEN",
        message
    })

    res.status(200).json({ success: true, data: "Reset link sent to email"})

};

const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex")

  const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
  })

  if(!user){
      res.status(401)
      throw new Error("Invalid token")
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined

  await user.save()

  res.status(200).json({ success: true, data: "Password updated successfully"})
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    }) 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
}

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true });

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};



const getSingleUser = async ( req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if(!user){
      res.status(401).json({message : 'user not found'})
    }

    res.status(200).json({success : true, data : user})
  } catch (error) {
    res.status(500).json({message : 'server error', error : error.message})
  }
}

// update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, 
      })

      if(!user){
        return res.status(404).json({
          success: false,
          message: "user not found"  
        })
      }
    
      res.status(200).json({
        success: true,
        data: user
      })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

// update admin profile

const updateAdminProfile = async (req, res) => {
 try {
  const admin = await User.findOne({_id: req.params.id, isAdmin: true})
  if(!admin){
    return res.status(404).json({success: false, message: "admin not found"})
  }
  const updateAdmin = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: ttrue
  })
  res.status(200).json({
    success: true,
    data: updateAdmin
  })

 } catch (error) {
  res.status(500).json({
    success: false,
    message: "server error",
    error: error.message
  })
 }

  
  
}


module.exports = {
  registerUser,
  registerAdmin,
  loginUser,
  loginAdmin,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getAllAdmins,
  getSingleUser,
  updateUserProfile,
  updateAdminProfile
};
