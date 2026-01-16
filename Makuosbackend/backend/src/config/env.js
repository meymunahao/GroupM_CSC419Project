require("dotenv").config();

module.exports = {
  app: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || "development",
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    resetSecret: process.env.JWT_RESET_SECRET,

    accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
    resetExpiresIn: "10m",
  },

  otp: {
    expiresInMinutes: 10,
  },

  security: {
    bcryptSaltRounds: 10,
    maxLoginAttempts: 5,
  },
};
