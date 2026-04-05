import { connectDB } from "../lib/db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const hasUri = !!process.env.MONGODB_URI;
    const hasSecret = !!process.env.JWT_SECRET;

    if (!hasUri) {
      return res.status(500).json({
        ok: false,
        error: "MONGODB_URI is not set",
        envKeys: Object.keys(process.env).filter(
          (k) => k.includes("MONGO") || k.includes("JWT")
        ),
      });
    }

    await connectDB();
    return res.status(200).json({
      ok: true,
      mongodb: "connected",
      hasJwtSecret: hasSecret,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
      stack: err.stack?.split("\n").slice(0, 3),
    });
  }
}
