require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// ─── Middleware ───
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

// ─── MongoDB Connection ───
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ─── User Schema ───
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true, minlength: 8 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// ─── Auth Middleware ───
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "غير مصرّح" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "الجلسة منتهية، سجّل الدخول مجدداً" });
  }
}

// ─── Routes ───

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({ token, name: user.name, email: user.email });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ token, name: user.name, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

// GET /api/auth/me  — verify token & return user info
app.get("/api/auth/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "المستخدم غير موجود" });
    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

// ─── Start ───
app.listen(PORT, () => {
  console.log(`🚀 Budget Buddy API running on http://localhost:${PORT}`);
});
