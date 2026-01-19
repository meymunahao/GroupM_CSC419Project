const cron = require("node-cron");
const prisma = require("../prisma");

// Runs every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

  const upcomingEvents = await prisma.event.findMany({
    where: {
      start_time: {
        gte: now,
        lte: inOneHour,
      },
    },
  });

  upcomingEvents.forEach(event => {
    console.log(`⏰ EVENT REMINDER:
- "${event.title}" starts at ${event.start_time}`);
  });
});
