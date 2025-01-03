const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.route.js");
const { connectDB } = require("./lib/db.js");
const cookieParser = require("cookie-parser");

require("dotenv").config();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

app.use(express.json());
app.use(cookieParser()); //allow to parse thecookie

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server is running on PORT:" + PORT);
    });
  } catch (error) {
    console.log("Unable to connect to database");
  }
})();
