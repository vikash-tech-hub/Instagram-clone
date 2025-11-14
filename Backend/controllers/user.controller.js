import { User } from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDatauri from "../utils/datauri.js";
import cloudinary from "cloudinary";
import { Post } from "../models/postmodel.js";

/* ===========================================
   REGISTER
=========================================== */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Something is missing, please check",
        success: false,
      });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({
        message: "Email already exists, try a different one",
        success: false,
      });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({
        message: "Username already taken, choose another",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: `${Object.keys(error.keyPattern)[0]} already exists`,
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

/* ===========================================
   LOGIN
=========================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    /* FIXED POST ERROR */
    const populatePost = await Promise.all(
      (user.posts || []).map(async (postId) => {
        const post = await Post.findById(postId);

        if (!post || !post.author) return null;

        if (post.author.equals(user._id)) return post;

        return null;
      })
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Welcome back",
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          bio: user.bio,
          followers: user.followers,
          following: user.following,
          posts: populatePost.filter(Boolean),
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

/* ===========================================
   LOGOUT
=========================================== */
export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "logout successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

/* ===========================================
   GET PROFILE
=========================================== */
export const getprofile = async (req, res) => {
  try {
    const userId = req.params.id;

    let user = await User.findById(userId).select("-password");

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

/* ===========================================
   EDIT PROFILE
=========================================== */
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    let cloudResponse;

    if (profilePicture) {
      const file = getDatauri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(file);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

/* ===========================================
   SUGGESTED USERS
=========================================== */
export const getSuggestedUsers = async (req, res) => {
  try {
    const SuggestedUsers = await User.find({
      _id: { $ne: req.id },
    }).select("-password");

    if (!SuggestedUsers || SuggestedUsers.length === 0) {
      return res.status(404).json({
        message: "currently do not have any users",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      users: SuggestedUsers,
    });
  } catch (error) {
    console.error("Error in getSuggestedUsers:", error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

/* ===========================================
   FOLLOW / UNFOLLOW
=========================================== */
export const followOrunfollow = async (req, res) => {
  try {
    const followkrnewala = req.id;
    const jiskoFollowKrunga = req.params.id;

    if (followkrnewala === jiskoFollowKrunga) {
      return res.status(401).json({
        message: "you cannot follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followkrnewala);
    const targetUser = await User.findById(jiskoFollowKrunga);

    if (!user || !targetUser) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    const isFollowing = user.following.includes(jiskoFollowKrunga);

    if (isFollowing) {
      await Promise.all([
        user.updateOne(
          { _id: followkrnewala },
          { $pull: { following: jiskoFollowKrunga } }
        ),
        targetUser.updateOne(
          { _id: jiskoFollowKrunga },
          { $pull: { followers: followkrnewala } }
        ),
      ]);

      return res.status(200).json({
        message: "user unfollowed successfully",
        success: true,
      });
    } else {
      await Promise.all([
        user.updateOne(
          { _id: followkrnewala },
          { $push: { following: jiskoFollowKrunga } }
        ),
        targetUser.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { followers: followkrnewala } }
        ),
      ]);

      return res.status(200).json({
        message: "user followed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
