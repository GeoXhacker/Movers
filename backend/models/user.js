const mongoose = require("mongoose");

let User = mongoose.Schema(
  {
    username: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    lastLogin: {
      type: Date,
      required: false,
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("User", User);
