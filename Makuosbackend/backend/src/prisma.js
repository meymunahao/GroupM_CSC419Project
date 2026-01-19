const { PrismaClient } = require("@prisma/client");

console.log("🔥 PRISMA CLIENT PATH:", require.resolve("@prisma/client"));

module.exports = new PrismaClient();
