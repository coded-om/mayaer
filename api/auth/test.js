import { connectDB } from "../lib/db.js";

/** Health check: reports whether required env vars are set and the DB is reachable. */
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  const hasUri = !!(process.env.MONGODB_URI || process.env.MONGODB_URL);
  const hasJwtSecret = !!process.env.JWT_SECRET;

  if (!hasUri) {
    return res.status(500).json({ ok: false, hasUri, hasJwtSecret });
  }

  try {
    await connectDB();
    return res.status(200).json({ ok: hasJwtSecret, mongodb: "connected", hasJwtSecret });
  } catch (err) {
    console.error("Health check error:", err);
    return res.status(500).json({ ok: false, mongodb: "failed", hasJwtSecret });
  }
}
