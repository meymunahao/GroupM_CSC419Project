const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/friend.controller");

router.use(auth);

// Friend requests
router.post("/request/:userId", controller.sendFriendRequest);
router.get("/requests/incoming", controller.getIncomingRequests);
router.get("/requests/outgoing", controller.getOutgoingRequests);
router.post("/request/accept/:requestId", controller.acceptFriendRequest);
router.post("/request/reject/:requestId", controller.rejectFriendRequest);

// Friends
router.get("/", controller.getFriends);
router.delete("/remove/:friendId", controller.removeFriend);

// Mutual friends
router.get("/mutual/:userId", controller.getMutualFriends);

module.exports = router;
