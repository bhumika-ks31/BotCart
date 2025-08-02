import User from "../model/userModel.js";
import validator from "validator"
import bcrypt from "bcryptjs"
import { genToken, genToken1 } from "../config/token.js";


export const registration = async (req,res) => {
  try {
    const {name , email, password} = req.body;
    const existUser = await User.findOne({email})
    if(existUser){
        return res.status(400).json({message:"User already exist"})
    }
    if(!validator.isEmail(email)){
         return res.status(400).json({message:"Enter valid Email"})
    }
    if(password.length < 8){
        return res.status(400).json({message:"Enter Strong Password"})
    }
    let hashPassword = await bcrypt.hash(password,10)

    const user = await User.create({name,email,password:hashPassword})
    let token = await genToken(user._id)
    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return res.status(201).json(user)
  } catch (error) {
    console.log("registration error")
    return res.status(500).json({message:`registration error ${error}`})
  }
    
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User is not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production with HTTPS
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(user); // Changed from 201 to 200
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};


export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,         // set to true in production
      sameSite: "Strict",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Logout error:", error);
    return res.status(500).json({ message: `Logout error: ${error.message}` });
  }
};


export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Invalid Google login data" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // You can also auto-generate a password here if needed
      user = await User.create({
        name,
        email,
        password: "google-oauth", // or a dummy hash if schema requires it
      });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production with HTTPS
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: `Google login error: ${error.message}` });
  }
};



export const adminLogin = async (req,res) => {
    try {
        let {email , password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        let token = await genToken1(email)
        res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite: "Strict",
        maxAge: 1 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json(token)
        }
        return res.status(400).json({message:"Invaild creadintials"})

    } catch (error) {
        console.log("AdminLogin error")
    return res.status(500).json({message:`AdminLogin error ${error}`})
        
    }
    
}

