import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // payload: { id, role, username, iat, exp }

    req.user = {
      id: payload.id,
      role: payload.role,
      username: payload.username || null,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
