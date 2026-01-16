const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const uploadController = require("../controllers/upload.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.use(authMiddleware);

router.get("/", profileController.getProfile);
// Search must come before `/:userId` to avoid route conflicts
router.get("/search", profileController.searchUsers);
router.get("/:userId", profileController.getUserProfileById);
router.post("/", profileController.createProfile);
router.put("/", profileController.updateProfile);
router.post("/interests", profileController.saveInterests);
router.post(
  "/photo",
  upload.single("photo"),
  uploadController.uploadPhoto
);


module.exports = router;
