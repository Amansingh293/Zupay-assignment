const express = require("express");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/postModel");
const router = express.Router();
const multer = require("multer");
const { uploadImageToS3, deleteImageFromS3 } = require("../s3");
const Comment = require("../models/commentModel");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadMiddleware = upload.single("image");

router.post(
  "/create-posts",
  uploadMiddleware,
  authMiddleware,
  async (request, response) => {
    try {
      if (!request.file) {
        return response
          .status(400)
          .json({ success: false, message: "No Image uploaded." });
      }

      const { title, description, userId, privateValue } = request.body;

      if (!title || !description) {
        return response.status(400).json({
          success: false,
          message: "title, description all are required",
        });
      }

      if (!userId) {
        return response
          .status(400)
          .json({ success: false, message: "Please relogin!!" });
      }

      const imageUrl = await uploadImageToS3(request.file);

      const post = new Post({
        title: title,
        description: description,
        userId: userId,
        imageUrl: imageUrl,
        private: privateValue,
      });

      await post.save();

      return response
        .status(201)
        .json({ success: true, message: "Blog Created!", data: post });
    } catch (error) {
      console.log(error.message);
      return response
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
    }
  }
);

router.get("/get-all-posts", authMiddleware, async (request, response) => {
  try {
    const allPosts = await Post.find({ userId: request.body.userId })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "-password",
        },
      })
      .populate({ path: "userId", select: "-password" });

    if (!allPosts) {
      return response
        .status(404)
        .json({ success: false, message: "No posts found!!" });
    }

    return response
      .status(200)
      .json({ success: true, message: "All posts retrieved", data: allPosts });
  } catch (error) {
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});

router.get(
  "/get-all-public-posts",
  authMiddleware,
  async (request, response) => {
    try {
      const allPosts = await Post.find({ private: false })
        .populate({
          path: "comments",
          populate: {
            path: "author",
            select: "-password",
          },
        })
        .populate({ path: "userId", select: "-password" });

      if (!allPosts) {
        return response
          .status(404)
          .json({ success: false, message: "No posts found!!" });
      }

      return response.status(200).json({
        success: true,
        message: "All public posts retrieved",
        data: allPosts,
      });
    } catch (error) {
      return response
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
    }
  }
);

router.get("/get-posts/:id", authMiddleware, async (request, response) => {
  try {
    const post = await Post.findById(request.params.id)
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "-password",
        },
      })
      .populate({ path: "userId", select: "-password" });

    if (!post) {
      return response
        .status(404)
        .json({ success: false, message: "No post found!!" });
    }

    return response
      .status(200)
      .json({ success: true, message: "Post retrieved", data: post });
  } catch (error) {
    console.log(error.message);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});

router.put(
  "/:id",
  uploadMiddleware,
  authMiddleware,
  async (request, response) => {
    try {
      const post = await Post.findById(request.params.id)
        .populate({
          path: "comments",
          populate: {
            path: "author",
            select: "-password",
          },
        })
        .populate({ path: "userId", select: "-password" });
      const { title, description, privateValue } = request.body;

      if (String(request.body.userId) !== String(post.userId._id)) {
        return response
          .status(404)
          .json({ success: false, message: "You cannot update this post!!" });
      }

      if (title) {
        post.title = title;
      }
      if (description) {
        post.description = description;
      }
      if (request.file) {
        await deleteImageFromS3(post.imageUrl);
        const imageUrl = await uploadImageToS3(request.file);
        post.imageUrl = imageUrl;
      }

      post.private = privateValue;

      await post.save();

      return response
        .status(200)
        .json({ success: true, message: "Post Updated!!", data: post });
    } catch (error) {
      return response
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
    }
  }
);

router.delete("/delete/:id", authMiddleware, async (request, response) => {
  try {
    const currentPost = await Post.findById(request.params.id);

    if (String(request.body.userId) !== String(currentPost.userId)) {
      return response
        .status(404)
        .json({ success: false, message: "You cannot delte this post!!" });
    }
    
    const post = await Post.findByIdAndDelete(request.params.id);

    return response
      .status(200)
      .json({ success: true, message: "Post Deleted!!" });
  } catch (error) {
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});

router.post("/comment", authMiddleware, async (request, response) => {
  try {
    const { userId, id, comment } = request.body;

    if (!comment) {
      return response.status(400).json({
        success: false,
        message: "comment required!",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return response.status(400).json({
        success: false,
        message: "User required !! please login !!",
      });
    }
    const post = await Post.findById(id);

    let newComment = new Comment({
      text: comment,
      author: userId,
    });

    newComment = await newComment.save();

    post.comments = [...post.comments, newComment._id];

    await post.save();

    const updatedPost = await Post.findById(id).populate({
      path: "comments",
      populate: {
        path: "author",
        select: "-password",
      },
    });

    return response
      .status(200)
      .json({ success: true, message: "Comment Added!", data: updatedPost });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
});

router.get("/search-post", authMiddleware, async (request, response) => {
  try {
    const { searchValue, user } = request.query;

    let posts = [];

    if (+user === 1) {
      posts = await Post.find({
        userId: request.body.userId,
        title: { $regex: searchValue, $options: "i" },
      })
        .populate({
          path: "comments",
          populate: {
            path: "author",
            select: "-password",
          },
        })
        .populate({ path: "userId", select: "-password" });
    } else {
      posts = await Post.find({
        title: { $regex: searchValue, $options: "i" },
        private: false,
      })
        .populate({
          path: "comments",
          populate: {
            path: "author",
            select: "-password",
          },
        })
        .populate({ path: "userId", select: "-password" });
    }

    if (!posts || posts.length === 0) {
      return response
        .status(404)
        .json({ success: false, message: "No posts found!!" });
    }
    return response.status(200).json({
      success: true,
      message: "Search posts found",
      data: posts,
    });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
});
module.exports = router;
