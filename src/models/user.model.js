const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema); //User is saved as users in database
module.exports = User;