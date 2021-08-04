const OrderModel = require("../models/orders");

exports.ApproveOrder = function (req, res) {
  let { orderId, userId } = req.params;
  OrderModel.findOneAndUpdate(
    { _id: orderId, user: userId },
    { status: "Approved" },
    (err, record) => {
      res.json(record);
    }
  );
};
