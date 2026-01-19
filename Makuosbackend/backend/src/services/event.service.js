const prisma = require("../prisma");
const crypto = require("crypto");

/**
 * Create a new event
 */
exports.createEvent = async ({
  creatorId,
  title,
  description,
  location,
  startTime,
  endTime,
}) => {
  return prisma.event.create({
    data: {
      creator_id: creatorId,                 // ✅ DB column
      title,
      description,
      location,
      start_time: new Date(startTime),        // ✅ DB column
      end_time: new Date(endTime),            // ✅ DB column
    },
  });
};

/**
 * Get all events
 */
exports.getAllEvents = async () => {
  return prisma.event.findMany({
    orderBy: { created_at: "desc" },
  });
};

/**
 * Get event by ID
 */
exports.getEventById = async (eventId) => {
  return prisma.event.findUnique({
    where: { id: Number(eventId) },
  });
};

/**
 * RSVP + Ticket
 */
exports.rsvpToEvent = async (eventId, userId) => {
  await prisma.event_rsvps.create({
    data: {
      event_id: Number(eventId),
      user_id: userId,
      status: "GOING",
    },
  });

  const ticketCode = crypto.randomUUID();

  return prisma.tickets.create({
    data: {
      event_id: Number(eventId),
      user_id: userId,
      ticket_code: ticketCode,
    },
  });
};

/**
 * Validate ticket
 */
exports.validateTicket = async (ticketCode) => {
  const ticket = await prisma.tickets.findUnique({
    where: { ticket_code: ticketCode },
  });

  if (!ticket || ticket.is_used) return false;

  await prisma.tickets.update({
    where: { ticket_code: ticketCode },
    data: { is_used: true },
  });

  return true;
};

/**
 * Search events
 */
exports.searchEventsByTitle = async (query) => {
  return prisma.event.findMany({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
  });
};
