import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db.js";
import { User } from "../lib/User.js";
import { signToken, cors } from "../lib/auth.js";

export default async function handler(req, res) {
  cors(res);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(401)
        .json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const token = signToken(user._id);
    res.json({ token, name: user.name, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "حدث خطأ في الخادم", detail: err.message });
  }
}
