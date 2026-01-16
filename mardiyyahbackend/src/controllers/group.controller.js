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

// NEW: list all groups
export const getAllGroups = async (req, res) => {
  const groups = await groupService.getAllGroups();
  res.json(groups);
};

export const getGroup = async (req, res) => {
  const groupRow = await groupService.getGroup(req.params.id);
  if (!groupRow) {
    return res.status(404).json({ message: "Group not found" });
  }

  const group = {
    id: groupRow.id,
    name: groupRow.name,
    handle: groupRow.handle,                 // or slug / something similar
    creator_name: groupRow.creator_name ?? "Unknown",
    created_at: groupRow.created_at,
    description: groupRow.description,
    avatar_url: groupRow.avatar_url ?? "/statue.png",
    banner_url: groupRow.banner_url ?? "/head.png",
  };

  res.json(group);
};


export const getGroupPosts = async (req, res) => {
  const rows = await groupService.getGroupPosts(req.params.id);

  const posts = rows.map((row) => ({
    id: row.id,
    author_name: row.author_name ?? row.username,   // fallback
    author_handle: row.author_handle ?? `@${row.username}`,
    content: row.content,
    avatar_url: row.avatar_url ?? "/nimi.png",
    media_url: row.media_url ?? null,
  }));

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
