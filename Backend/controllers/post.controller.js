import sharp from "sharp";
import { Post } from "../models/postmodel.js";
import { User } from "../models/usermodel.js"

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        if (!image) {
            return res.status(400).json({
                message: "Image is required"
            })
        }
        // image upload
        const optimizedBuffer = await sharp(image.buffer).resize({ width: 800, height: 600, fit: 'inside' }).toFormat('jpeg').jpeg({ quality: 80 }).toBuffer();
        const fileUri = `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri)
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        })
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({ path: 'author', select: '-password' });


        return res.status(201).json({
            message: "Post created successfully",

            post,
            success: true
        })

    } catch (error) {
        console.log(error);

    }
}
export const getAllPost = async (req, res) => {
    try {
        const post = await Post.find().sort({ createdAt: -1 }).populate({ path: 'author', select: 'username', profilePicture })
        .populate({ path: 'comments', sort: { createdAt: -1 }, populate: { path: 'author', select: 'username', profilePicture } })
        return res.status(200).json({
            message: "All post",
            post,
            success: true
        })
    } catch (error) {

    }
}
export const getUserPost = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        
        
    }
}
      