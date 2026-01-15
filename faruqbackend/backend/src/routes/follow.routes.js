const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/follow.controller");

router.use(auth);

router.post("/:userId", controller.followUser);
router.delete("/:userId", controller.unfollowUser);

router.get("/followers/:userId", controller.getFollowers);
router.get("/following/:userId", controller.getFollowing);

module.exports = router;
 