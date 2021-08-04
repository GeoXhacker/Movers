const mongoose = require("mongoose");

let DeliveryOrder = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    what: { type: String, required: true },
    instructions: { type: String, required: true },
    recipient: { type: Number, required: true },
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
      default: "failed to load place",
    },
    destinationAddressName: {
      type: String,
      default: "failed to load place",
    },
    status: {
      type: String,
      default: "PENDING",
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

module.exports = mongoose.model("DeliveyOrder", DeliveryOrder);
