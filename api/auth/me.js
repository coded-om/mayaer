import { connectDB } from "../lib/db.js";
import { User } from "../lib/User.js";
import { verifyToken, cors } from "../lib/auth.js";

export default async function handler(req, res) {
  cors(res);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "غير مصرّح" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error("Me error:", err);
    res.status(401).json({ error: "الجلسة منتهية، سجّل الدخول مجدداً" });
  }
}
