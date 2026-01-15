const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ================= SEND REQUEST ================= */
exports.sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot friend yourself" });
    }

    const alreadyFriends = await prisma.friendship.findFirst({
      where: { userId: senderId, friendId: receiverId }
    });

    if (alreadyFriends) {
      return res.status(400).json({ message: "Already friends" });
    }

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        senderId,
        receiverId,
        status: "PENDING"
      }
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    await prisma.friendRequest.create({
      data: { senderId, receiverId }
    });

    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "FRIEND_REQUEST",
        data: { senderId }
      }
    });

    res.json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send request" });
  }
};

/* ================= ACCEPT REQUEST ================= */
exports.acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;

    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    });

    if (!request || request.receiverId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.$transaction([
      prisma.friendship.create({
        data: { userId: request.senderId, friendId: request.receiverId }
      }),
      prisma.friendship.create({
        data: { userId: request.receiverId, friendId: request.senderId }
      }),
      prisma.friendRequest.delete({
        where: { id: requestId }
      }),
      prisma.notification.create({
        data: {
          userId: request.senderId,
          type: "FRIEND_ACCEPTED"
        }
      })
    ]);

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to accept request" });
  }
};

/* ================= REJECT REQUEST ================= */
exports.rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;

    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    });

    if (!request || request.receiverId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.friendRequest.delete({
      where: { id: requestId }
    });

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject request" });
  }
};

/* ================= REMOVE FRIEND ================= */
exports.removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.friendId;

    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId }
        ]
      }
    });

    res.json({ message: "Friend removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove friend" });
  }
};

/* ================= GET FRIENDS ================= */
exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await prisma.friendship.findMany({
      where: { userId },
      include: {
        friend: {
          select: { id: true, email: true }
        }
      }
    });

    res.json(friends);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch friends" });
  }
};

/* ================= INCOMING REQUESTS ================= */
exports.getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: "PENDING"
      },
      include: {
        sender: {
          select: { id: true, email: true }
        }
      }
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch incoming requests" });
  }
};

/* ================= OUTGOING REQUESTS ================= */
exports.getOutgoingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: "PENDING"
      },
      include: {
        receiver: {
          select: { id: true, email: true }
        }
      }
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch outgoing requests" });
  }
};

/* ================= MUTUAL FRIENDS ================= */
exports.getMutualFriends = async (req, res) => {
  try {
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
    const mutual = theirFriends.filter(f => mySet.has(f.friendId));

    res.json({
      count: mutual.length,
      mutualFriends: mutual
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch mutual friends" });
  }
};
