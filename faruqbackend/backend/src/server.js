require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Only listen if not running on Vercel
if (process.env.VERCEL_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for Vercel
module.exports = app;
