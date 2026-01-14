import * as postService from "../services/post.service.js";

export const createPost = async (req, res) => {
  const post = await postService.createPost(req.user.id, req.body);
  res.status(201).json(post);
};

export const getFeed = async (req, res) => {
  const posts = await postService.getFeed(req.user.id, req.query);
  res.json(posts);
};

export const getSinglePost = async (req, res) => {
  const post = await postService.getPostById(req.params.id);
  res.json(post);
};

export const updatePost = async (req, res) => {
  const post = await postService.updatePost(req.user.id, req.params.id, req.body);
  res.json(post);
};

export const deletePost = async (req, res) => {
  await postService.deletePost(req.user.id, req.params.id);
  res.json({ success: true });
};

export const reactToPost = async (req, res) => {
  await postService.react(req.user.id, req.params.id, req.body.reaction);
  res.json({ success: true });
};
