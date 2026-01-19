const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/notification.controller");

router.use(auth);

router.get("/", controller.getNotifications);
router.put("/:id/read", controller.markAsRead);

module.exports = router;
