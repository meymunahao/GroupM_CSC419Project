// src/controllers/post.controller.js
import * as postService from "../services/post.service.js";
import cloudinary from "../config/cloudinary.js";
import db from "../config/db.js";

const TEMP_USER_ID = 1;

export const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await postService.createPost(userId, req.body);
    res.status(201).json(post);
  } catch (err) {
    console.error("createPost controller error:", err);
    res.status(500).json({ message: "Something went wrong while posting" });
  }
};


export const getFeed = async (req, res) => {
  const userId = TEMP_USER_ID;

  const posts = await postService.getFeed(userId, req.query);
  res.json(posts);
};

export const getSinglePost = async (req, res) => {
  const post = await postService.getPostById(req.params.id);
  res.json(post);
};

export const updatePost = async (req, res) => {
  const userId = TEMP_USER_ID;

  const post = await postService.updatePost(
    userId,
    req.params.id,
    req.body
  );
  res.json(post);
};

export const deletePost = async (req, res) => {
  const userId = TEMP_USER_ID;

  await postService.deletePost(userId, req.params.id);
  res.json({ success: true });
};

export const reactToPost = async (req, res) => {
  const userId = TEMP_USER_ID;

  await postService.react(userId, req.params.id, req.body.reaction);
  res.json({ success: true });
};

// uploadPostMedia stays as you already have it


export const uploadPostMedia = async (req, res) => {
  try {
    const { id: postId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const mime = req.file.mimetype;
    const mediaType = mime.startsWith("video") ? "video" : "image";

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: mediaType === "video" ? "video" : "image",
          folder: "posts",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const mediaUrl = uploadResult.secure_url;

    const { rows } = await db.query(
      `INSERT INTO post_media (post_id, media_type, media_url, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, post_id, media_type, media_url, created_at`,
      [postId, mediaType, mediaUrl]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error uploading post media:", err);
    res.status(500).json({ error: "Failed to upload media" });
  }
};

