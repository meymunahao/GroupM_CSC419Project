import * as groupService from "../services/group.service.js";

export const createGroup = async (req, res) => {
  const group = await groupService.createGroup(req.user.id, req.body);
  res.status(201).json(group);
};

export const joinGroup = async (req, res) => {
  await groupService.joinGroup(req.user.id, req.params.id);
  res.json({ message: "Join request sent" });
};

export const leaveGroup = async (req, res) => {
  await groupService.leaveGroup(req.user.id, req.params.id);
  res.json({ message: "Left group" });
};

export const approveMember = async (req, res) => {
  await groupService.approveMember(
    req.user.id,
    req.params.id,
    req.params.userId
  );
  res.json({ message: "Member approved" });
};

export const getGroup = async (req, res) => {
  const group = await groupService.getGroup(req.params.id);
  res.json(group);
};

export const getGroupPosts = async (req, res) => {
  const posts = await groupService.getGroupPosts(req.params.id);
  res.json(posts);
};

export const createGroupPost = async (req, res) => {
  const post = await groupService.createGroupPost(
    req.user.id,
    req.params.id,
    req.body
  );
  res.status(201).json(post);
};

export const searchGroups = async (req, res) => {
  const groups = await groupService.searchGroups(req.query.q);
  res.json(groups);
};
