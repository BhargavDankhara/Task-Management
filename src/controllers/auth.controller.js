import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";
import { genTokenAndSetCookie } from "../../utils/generateToken.js";

//signup
export async function signup(req, res) {
  try {
    const { email, password, username, role } = req.body;

    // Validate input fields
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists by email
    const existingUserByEmail = await User.findOne({ email: email });

    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Check if user already exists by username
    const existingUserByUsername = await User.findOne({ username: username });

    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    // Hash the password using bcryptjs
    const salt = await bcryptjs.genSalt(15);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a user profile pic
    const PROFILE_PICS = ["/user1.png", "/user2.png", "/user3.png"];

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    // Create a new profile
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
      role,
    });

    // Generate and set JWT token and cookie
    genTokenAndSetCookie(newUser._id, res);
    await newUser.save();
    // Remove sensitive fields before sending response
    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error in contr", error.message);
    res.status(500), json({ success: false, message: "Internal Server Error" });
  }
}

// login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // find user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check if password is correct using bcryptjs
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate and set JWT token and cookie
    genTokenAndSetCookie(user._id, res);

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// logout
export async function logout(req, res) {
  try {
    res.clearCookie("jwt-task");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
