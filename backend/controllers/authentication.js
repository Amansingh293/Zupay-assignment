const express = require("express");
const User = require("../models/userModel");

const router = express.Router();
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

router.post("/register", async (request, response) => {
  try {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return response.status(400).json({
        success: false,
        message: "Email , password , username all are required",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      const saltRounds = 10;

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
      });

      await newUser.save();

      return response
        .status(201)
        .json({ success: true, message: "User Created ! Please Login" });
    } else {
      return res
        .status(403)
        .json({ success: false, message: "User Already Exists" });
    }
  } catch (error) {
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      response
        .status(404)
        .send({ success: false, message: "No User Exists !! Please SignUp" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      response.status(401).send({
        success: false,
        message: "Invalid Credentails",
      });
      return;
    }

    const jwtToken = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_KEY
    );

    response.status(200).send({
      success: true,
      message: "User Logged in",
      data: jwtToken,
    });
    return;
  } catch (err) {
    console.log(err.message);
    response.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
