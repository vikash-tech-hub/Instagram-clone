import User from "../models/usermodel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
export const register=async(requestAnimationFrame,res)=>{
    try {
        const {username,email,password}=req.body
        if (!username || !email || !password){
            return res.status(401).json({
                message:"something is missing please check",
                success:false
            })
        }
        const user=await User.findone({email})
        if (user){
            return res.status(401).json({
                message:"try diffrent email",
                success:false
            })
        }
        const hashedPassword=await bcrypt.hash(password,10)
        await User.create({
            username,
            email,
            password:hashedPassword
        })
        return res.status(201).json({
                message:"Account created successfully",
                success:true
        })
    } catch (error) {
        console.log(error)
    }
}
export const login=async(req,res)=>{
    try {
        const {email,password}=req.body
        if ( !email || !password){
            return res.status(401).json({
                message:"something is missing please check",
                success:false
            })
        }
        let user=await User.findone({email})
        if (!user){
            return res.status(401).json({
                message:"incorrect email and password",
                success:false
            })
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password)
        if (!isPasswordMatch){
            return res.status(401).json({
                message:"incorrect email and password",
                success:false
            })
        }
        user={
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:user.posts
        }
        const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'})
        return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
            message:"welcome back",
            success:true
        })
    } catch (error) {
        console.log(error);
        
        
    }
}
export const logout=async(_,res)=>{
    try {
        return res.cookie("token"|"",{maxAge:0}).json({
            message:"logout successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
        
        
    }
}
export const getprofile =async(req,res)=>{
    try {
        const userId=req.params.id;
        let user=await User.findById(userId)
        return res.status(200).json({
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}
export const editProfile=async(req,res)=>{
    try {
        const userId=req.id
        const {bio,gender}=req.body
        const profilePicture=req.file
        let cloudResponse
        
    } catch (error) {
        console.log((error));
        
    }
}