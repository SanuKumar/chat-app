const bcrypt = require("bcryptjs");
const generateToken = require("../lib/utils");
const User = require("../models/user.model");

module.exports = {
  signup: async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // check password length
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
      // check if user already exists using mailid
      const user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });

      // hashed password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
      });
      if (newUser) {
        // generate jwt token
        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
        });
      } else {
        return res.status(400).json({ message: "Invalid user data" });
      }
    } catch (error) {
      console.log("Error in signup controller:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      generateToken(user._id, res);

      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      console.log("Error in login controller:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  logout: async (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 }); //clear the cookies from the server
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log("Error in logout controller:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  updateProfile: async () => {},
};
