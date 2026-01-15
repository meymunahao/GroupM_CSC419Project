const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getSocialCounts = async (req, res) => {
  const userId = req.user.id;

  try {
    const [
      friendsCount,
      followersCount,
      followingCount,
      pendingRequestsCount,
      sentRequestsCount
    ] = await Promise.all([

      // Friends (each friendship stored twice)
      prisma.friendship.count({
        where: { userId }
      }),

      // Followers
      prisma.follow.count({
        where: { followingId: userId }
      }),

      // Following
      prisma.follow.count({
        where: { followerId: userId }
      }),

      // Incoming friend requests
      prisma.friendRequest.count({
        where: {
          receiverId: userId,
          status: "PENDING"
        }
      }),

      // Outgoing friend requests
      prisma.friendRequest.count({
        where: {
          senderId: userId,
          status: "PENDING"
        }
      })
    ]);

    res.json({
      friendsCount,
      followersCount,
      followingCount,
      pendingRequestsCount,
      sentRequestsCount
    });

  } catch (err) {
    console.error("SOCIAL COUNTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * GET /api/social/friends/mutual/:userId/count
 */
exports.getMutualFriendsCount = async (req, res) => {
  const userId = req.user.id;
  const otherUserId = req.params.userId;

  const myFriends = await prisma.friendship.findMany({
    where: { userId },
    select: { friendId: true }
  });

  const theirFriends = await prisma.friendship.findMany({
    where: { userId: otherUserId },
    select: { friendId: true }
  });

  const mySet = new Set(myFriends.map(f => f.friendId));

  const mutualCount = theirFriends.filter(f =>
    mySet.has(f.friendId)
  ).length;

  res.json({ mutualFriendsCount: mutualCount });
};
