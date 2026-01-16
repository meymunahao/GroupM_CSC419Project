const eventService = require("../services/event.service");

/**
 * Create event
 */
exports.createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      error: error.message,
      code: error.code || null
    });
  }
};

/**
 * Get all events
 */
exports.getAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

/**
 * Get event by ID
 */
exports.getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

/**
 * RSVP to event
 */
exports.rsvpToEvent = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const ticket = await eventService.rsvpToEvent(
      req.params.id,
      userId
    );

    res.status(201).json(ticket);
  } catch (error) {
    console.error("RSVP error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Validate ticket
 */
exports.validateTicket = async (req, res) => {
  try {
    const { ticketCode } = req.body;

    if (!ticketCode) {
      return res.status(400).json({ error: "ticketCode is required" });
    }

    const valid = await eventService.validateTicket(ticketCode);
    res.json({ valid });
  } catch (error) {
    console.error("Ticket validation error:", error);
    res.status(500).json({ error: "Ticket validation failed" });
  }
};

/**
 * Search events by title
 */
exports.searchEvents = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const events = await eventService.searchEventsByTitle(q);
    res.json(events);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};
