const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");


// 🔹 REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, course } = req.body;

  try {
    let user = await Student.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new Student({
      name,
      email,
      password: hashedPassword,
      course
    });

    await user.save();

    res.json({ msg: "User registered successfully" });

  } catch (err) {
    res.status(500).send("Server error");
  }
});


// 🔹 LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Student.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.json({ token });

  } catch (err) {
    res.status(500).send("Server error");
  }
});


// 🔹 GET USER DETAILS (🔥 NEW - IMPORTANT)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await Student.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    res.status(500).send("Error");
  }
});


// 🔹 UPDATE PASSWORD
router.put("/update-password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await Student.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong old password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password updated" });

  } catch {
    res.status(500).send("Error");
  }
});


// 🔹 UPDATE COURSE
router.put("/update-course", auth, async (req, res) => {
  const { course } = req.body;

  try {
    const user = await Student.findById(req.user.id);

    user.course = course;
    await user.save();

    res.json({ msg: "Course updated" });

  } catch {
    res.status(500).send("Error");
  }
});


// 🔹 TEST
router.get("/", (req, res) => {
  res.send("Auth route working");
});

module.exports = router;