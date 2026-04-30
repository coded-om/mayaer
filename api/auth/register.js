import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db.js";
import { User } from "../lib/User.js";
import { signToken, cors } from "../lib/auth.js";

export default async function handler(req, res) {
  cors(res, req);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "كلمة المرور 8 أحرف على الأقل" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ error: "هذا البريد الإلكتروني مسجّل مسبقاً" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
    });

    const token = signToken(user._id);
    res.status(201).json({ token, name: user.name, email: user.email });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "حدث خطأ في الخادم", detail: err.message });
  }
}
