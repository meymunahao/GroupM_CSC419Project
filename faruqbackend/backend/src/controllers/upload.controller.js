const { cloudinary } = require("../firebase");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.uploadPhoto = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "profiles",
      resource_type: "auto",
    });

    // remove temp file
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Error removing temp file:", err);
    }

    const photoUrl = result.secure_url;

    // Upsert profile record to set photoUrl (create profile if missing)
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: { photoUrl },
      create: { userId, photoUrl }
    });

    res.json({ photoUrl: profile.photoUrl });
  } catch (error) {
    // attempt to remove temp file on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Error removing file:", err);
      }
    }
    res.status(500).json({ error: error.message });
  }
};
