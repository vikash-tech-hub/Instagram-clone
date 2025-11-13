import sharp from "sharp";
import { Post } from "../models/postmodel.js";
import { User } from "../models/usermodel.js"
import { Comment } from "../models/commentmodel.js";
import cloudinary from "../utils/cloudinary.js"

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
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture"
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture"
        }
      });

    return res.status(200).json({
      message: "All post",
      post,
      success: true
    });

  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({ path: 'author', select: 'username profilePicture' })
            .populate({ path: 'comments', sort: { createdAt: -1 }, populate: { path: 'author', select: 'username', profilePicture } })
        return res.status(200).json({
            message: "User post",
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);


    }
}
export const likePost = async (req, res) => {
    try {
        const likeKrneWalaUserId = req.id
        const postId = req.params.id

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }
        // like logic start
        await post.updateOne({ $addToSet: { likes: likeKrneWalaUserId } })
        await post.save()

        // implemet socket io
        return res.status(200).json({
            message: "Post liked",
            success: true
        })


    } catch (error) {
        console.log(error);

    }
}
export const dislikePost = async (req, res) => {
    try {
        const likeKrneWalaUserId = req.id
        const postId = req.params.id
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }
        // like logic start
        await post.updateOne({ $pull: { likes: likeKrneWalaUserId } })
        await post.save()

        // implemet socket io
        return res.status(200).json({
            message: "Post disliked",
            success: true
        })


    } catch (error) {
        console.log(error);

    }
}
export const addComment = async (req, res) => {
    try {
        const postId = req.params.id
        
        const commentKarneWalaUserKiId = req.id
        const { text } = req.body
        const post = await Post.findById(postId)
        if (!text) {
            return res.status(400).json({
                message: "text is required",
                success: false
            })
        }
        const comment = await Comment.create({
            text,
            author: commentKarneWalaUserKiId,
            post: postId

        })
        await comment.populate({
            path: 'author',
            select: 'username profilePicture'
        })
        post.comments.push(comment._id)
        await post.save()
        return res.status(200).json({
            message: "Comment added",
            comment,
            success: true
        })

    } catch (error) {
        console.log(error);

    }
}
export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id
        const comments = await Comment.find({ post: postId }).populate('author', 'username', 'profilePicture')
        if (!comments) {
            return res.status(404).json({
                message: "No comments found",
                success: false
            })
        }
        return res.status(200).json({
            message: "All comments",
            comments,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}
export const deletePost = async (req, res) => {
    try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "You are not authorized to delete this post",
        success: false,
      });
    }

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(authorId);
    if (user && Array.isArray(user.posts)) {
      user.posts = user.posts.filter((id) => id.toString() !== postId);
      await user.save();
    }

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while deleting post",
      success: false,
    });
  }
};

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id
        const authorId = req.id
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }
        const user = await User.findById(authorId)
        if (user.bookmarks.includes(post._Id)) {
            await user.updateOne({ $pull: { bookmarks: post._id } })
            await user.save()
            return res.status(200).json({
                type: 'unsave',
                message: "Post removed from bookmarks",
                success: true
            })
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } })
            await user.save()
            return res.status(200).json({
                type: 'saved',
                message: "Post  bookmarked",
                success: true
            })
        }
    } catch (error) {
        console.log(error);

    }
}