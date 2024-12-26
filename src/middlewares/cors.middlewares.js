const cors = require("cors");

const {
  cors: { allowOrigin },
} = require("../config");

const corsOptions = {
  origin: allowOrigin,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
