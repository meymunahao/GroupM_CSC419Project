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
 * Update profile fields
 */
exports.updateProfile = async (req, res) => {
  try {
    const { bio, links, privacy } = req.body;

    const profile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        bio,
        links,
        privacy
      }
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
