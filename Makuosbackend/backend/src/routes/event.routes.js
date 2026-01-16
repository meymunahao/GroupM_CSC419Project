const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event.controller");

// 🔹 TEST ROUTE (temporary – for debugging)
router.get("/__test", (req, res) => {
  res.status(200).json({ message: "EVENT ROUTES WORKING" });
});

// 🔹 Create event
router.post("/", eventController.createEvent);

// 🔹 Get all events
router.get("/", eventController.getAllEvents);

// 🔹 Search events by title
router.get("/search", eventController.searchEvents);

// 🔹 Get single event
router.get("/:id", eventController.getEventById);

// 🔹 RSVP to event
router.post("/:id/rsvp", eventController.rsvpToEvent);

// 🔹 Validate ticket
router.post("/ticket/validate", eventController.validateTicket);

module.exports = router;
