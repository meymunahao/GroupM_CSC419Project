const { cloudinary } = require("../firebase");
const fs = require("fs");

exports.uploadPhoto = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "profiles",
      resource_type: "auto",
    });

    fs.unlinkSync(filePath);
    res.json({ photoUrl: result.secure_url });
  } catch (error) {
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
