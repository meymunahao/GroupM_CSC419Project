const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Follow user
 */
exports.followUser = async (req, res) => {
  await prisma.follow.create({
    data: {
      followerId: req.user.id,
      followingId: req.params.userId
    }
  });

  res.json({ message: "User followed" });
};

/**
 * Unfollow user
 */
exports.unfollowUser = async (req, res) => {
  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    }
  });

  res.json({ message: "User unfollowed" });
};

/**
 * Get followers
 */
exports.getFollowers = async (req, res) => {
  const followers = await prisma.follow.findMany({
    where: { followingId: req.params.userId },
    include: {
      follower: { select: { id: true, email: true } }
    }
  });

  res.json(followers);
};

/**
 * Get following
 */
exports.getFollowing = async (req, res) => {
  const following = await prisma.follow.findMany({
    where: { followerId: req.params.userId },
    include: {
      following: { select: { id: true, email: true } }
    }
  });

  res.json(following);
};
