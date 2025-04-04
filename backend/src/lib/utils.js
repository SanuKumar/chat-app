import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true, // Cookie cannot be accessed by client
    sameSite: "strict", // Cookie is sent only to the same origin as the request
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
