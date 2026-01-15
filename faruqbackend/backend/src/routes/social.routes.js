const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
  getSocialCounts,
  getMutualFriendsCount
} = require("../controllers/social.controller");

router.get("/counts", auth, getSocialCounts);
router.get("/friends/mutual/:userId/count", auth, getMutualFriendsCount);

module.exports = router;
