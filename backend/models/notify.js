const sendSms = require("../utils/softphone");
const UserModel = require("../models/user");

const mongoose = require("mongoose");
const NotifySchema = mongoose.Schema({
  user: { type: String, required: true },
  order: { type: String, required: true },
  status: { type: String, required: true },
  message: { type: String },
});

NotifySchema.post("save", async function (doc) {
  let user = await this.model("User").findById(doc.user);
  console.log("middleware");
  console.log(doc);

  sendSms(
    user.phone,
    `${user.username}, Your Order with ref ${doc.order} has been Approved, thank you`,
    function (result) {}
  );
});

module.exports = mongoose.model("notifications", NotifySchema);
