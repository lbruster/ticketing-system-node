import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();

// Post api/users/signUp
router.post("/signup", async (req, res) => {
  let user;
  user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User aslready registered.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  try {
    user.save();

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.header("Authorization", token).send({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).send("Error saving user, Something went wrong", error);
  }
});

// Post api/users/login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");
  const validPasword = await bcrypt.compare(req.body.password, user.password);

  if (!validPasword) return res.status(400).send("Invalid email or password");

  const token = jwt.sign(
    {
      _id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.header("Authorization", token).send(token);
});

export default router;
