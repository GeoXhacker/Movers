const DeliveryModel = require("../models/delivery");
const xtend = require("xtend");
// const moment = require("moment");
const moment = require("moment-timezone");
const { latLonToPlace } = require("../utils/geoplugin");

exports.makeDeliveryOrder = async function (req, res, next) {
  // console.log(req.user)

  // console.log(packageOrder)

  // const [destinationAddress, pickUpAddress] = await Promise.all([
  //   latLonToPlace(
  //     req.body.destinationAddress.lat,
  //     req.body.destinationAddress.lng
  //   ),
  //   latLonToPlace(
  //     req.body.destinationAddress.lat,
  //     req.body.destinationAddress.lng
  //   ),
  // ]);

  const packageData = xtend(req.body, {
    user: req.user.id,
    destinationAddressName:
      // destinationAddress.geoplugin_place
      "nansana",
    pickUpAddressName:
      // pickUpAddress.geoplugin_place,
      "kampala",
  });
  const packageOrder = new DeliveryModel(packageData);

  packageOrder.save((err, record) => {
    if (err) {
      console.log(err.message);
      return next(new Error("Order failed to be saved to db"));
    }
    res.send({
      orderInfo: {
        what: record.what,
        instructions: record.instructions,
        recipient: record.recipient,
        pickUpAddress: record.pickUpAddress,
        destinationAddress: record.destinationAddress,
        pickUpAddressName: record.destinationAddressName,
        destinationAddressName: record.destinationAddressName,
        id: record.id,
        status: record.status,
        date: moment(record.createdAt)
          .tz("Africa/Kampala")
          .format("MMMM Do YYYY, h:mm:ss a"),
      },
      message: "Thanks, your order was successfully sent.",
    });
    console.log(packageOrder, "order dispatched to frontend");
  });
};

exports.getOrders = async function (req, res) {
  let orders = await DeliveryModel.find(req.query).populate({
    path: "user",
    select: "username phone",
  });
  res.json(orders);
};

exports.confirmOrder = async function (req, res, next) {
  let order = await DeliveryModel.findByIdAndUpdate(req.params.id, {
    status: "APPROVED",
    confirmedAt: new Date(),
  });

  let notification = await NotifyModel.create({
    user: order.user,
    order: order._id,
    status: order.status,
  }).catch((e) => {
    console.log("failed to create notification in db");
  });

  res.json({
    order: order._id,
    user: order.user,
    status: order.status,
    confirmedAt: order.confirmedAt,
  });
};

exports.getOrder = async function (req, res, next) {
  let order = await DeliveryModel.findById(req.params.id);
  res.json(order);
};

exports.deleteOrder = async function (req, res, next) {
  let order = await DeliveryModel.findByIdAndDelete(req.params.id);
  res.json(order);
};
