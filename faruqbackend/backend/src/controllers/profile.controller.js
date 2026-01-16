const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET /api/profile
 * Get authenticated user's profile
 */
exports.getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        interests: true,
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/profile
 * Create profile + set username
 */
exports.createProfile = async (req, res) => {
  try {
    const { username, bio, links, privacy } = req.body;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Valid username is required" });
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });

    if (existingProfile) {
      return res.status(400).json({ error: "Profile already exists" });
    }

    // Check username uniqueness
    const usernameTaken = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive"
        }
      }
    });

    if (usernameTaken) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const profile = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: req.user.id },
        data: { username }
      });

      return tx.profile.create({
        data: {
          userId: req.user.id,
          bio,
          links,
          privacy
        }
      });
    });

    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/profile
 * Update profile fields (including username)
 */
exports.updateProfile = async (req, res) => {
  try {
    const { bio, links, privacy, username } = req.body;

    // If username is provided, check uniqueness
    if (username) {
      const usernameTaken = await prisma.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: "insensitive"
          },
          id: {
            not: req.user.id
          }
        }
      });

      if (usernameTaken) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    const profile = await prisma.$transaction(async (tx) => {
      // Update username on User table if provided
      if (username) {
        await tx.user.update({
          where: { id: req.user.id },
          data: { username }
        });
      }

      // Update profile fields
      return tx.profile.update({
        where: { userId: req.user.id },
        data: {
          bio,
          links,
          privacy
        },
        include: {
          user: {
            select: {
              username: true,
              email: true
            }
          }
        }
      });
    });

    res.json(profile);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/profile/interests
 * Save profile interests
 */
exports.saveInterests = async (req, res) => {
  try {
    const { interests } = req.body;

    if (!Array.isArray(interests)) {
      return res.status(400).json({ error: "Interests must be an array" });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    await prisma.$transaction([
      prisma.interest.deleteMany({
        where: { profileId: profile.id }
      }),
      prisma.interest.createMany({
        data: interests.map((name) => ({
          name,
          profileId: profile.id
        }))
      })
    ]);

    res.json({ message: "Interests saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/profile/search?q=term&page=1&limit=20
 * Search users by username, email, or profile fields (paginated)
 */
exports.searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.status(400).json({ error: "Query param `q` is required" });

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { username: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { profile: { bio: { contains: q, mode: "insensitive" } } },
        { profile: { website: { contains: q, mode: "insensitive" } } }
      ]
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        include: {
          profile: {
            select: { photoUrl: true, bio: true }
          }
        },
        skip,
        take: limit,
        orderBy: { username: "asc" }
      })
    ]);

    res.json({ results: users, page, limit, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/profile/:userId
 * Get any user's profile by userId with full social info
 */
exports.getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        interests: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            isEmailVerified: true,
            createdAt: true,
            _count: {
              select: {
                followers: true,
                following: true,
                friends: true,
                posts: true
              }
            }
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
