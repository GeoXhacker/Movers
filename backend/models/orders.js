const mongoose = require("mongoose");

let Order = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "Moving",
    },
    moveType: {
      type: String,
      required: true,
      enum: ["Within Kampala", "Outside Kampala"],
    },
    pickUpAddress: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    destinationAddress: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    pickUpAddressName: {
      type: String,
      default: "unknown",
    },
    destinationAddressName: {
      type: String,
      default: "unknown",
    },
    shiftNeed: { type: String, required: true },
    scheduleDate: { type: String, required: true },
    status: {
      type: String,
      default: "PENDING",
    },
    confirmedAt: {
      type: Date,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", Order);
