import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePicture: newUser.profilePic,
        },
        message: "User created successfully",
      });
    } else {
      return res
        .status(400)
        .json({ user: {}, message: "User could not be created" });
    }
  } catch (error) {
    console.log("Error in signup: ", error.message);
    return res.status(500).json({ user: {}, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePic,
      },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log("Error in login: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  const { fullName, email, password, profilePic } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (fullName) {
      user.fullName = fullName;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (profilePic) {
      user.profilePic = profilePic;
    }
    await user.save();
    return res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePic,
      },
      message: "User updated successfully",
    });
  } catch (error) {
    console.log("Error in updateProfile: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
