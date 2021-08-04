const OrderModel = require("../models/orders");
const UserModel = require("../models/user");
const NotifyModel = require("../models/notify");
const xtend = require("xtend");
// const moment = require("moment");
const moment = require("moment-timezone");
const { latLonToPlace } = require("../utils/geoplugin");

exports.makeOrder = async function (req, res, next) {
  // const getPlaceNames = new Promise((resolve, reject) => {
  //   latLonToPlace(
  //     req.body.destinationAddress.lat,
  //     req.body.destinationAddress.lng
  //   );
  //   latLonToPlace(
  //     req.body.destinationAddress.lat,
  //     req.body.destinationAddress.lng
  //   );
  // });
  // getPlacesNames.then();

  const [destinationAddress, pickUpAddress] = await Promise.all([
    latLonToPlace(
      req.body.destinationAddress.lat,
      req.body.destinationAddress.lng
    ),
    latLonToPlace(
      req.body.destinationAddress.lat,
      req.body.destinationAddress.lng
    ),
  ]);

  const orderData = xtend(req.body, {
    user: req.user.id,
    destinationAddressName: destinationAddress.geoplugin_place,
    pickUpAddressName: pickUpAddress.geoplugin_place,
  });

  const newOrder = new OrderModel(orderData);

  newOrder.save(async (err, record) => {
    if (err) {
      console.log(err.message);
      return next(new Error("Order failed to be saved to db"));
    }
    // return console.log(record);
    res.send({
      orderInfo: {
        moveType: record.moveType,
        destinationAddress: record.destinationAddress,
        pickUpAddress: record.pickUpAddress,
        destinationAddressName: record.destinationAddressName,
        pickUpAddressName: record.pickUpAddressName,
        shiftNeed: record.shiftNeed,
        id: record.id,
        status: record.status,
        scheduleDate: record.scheduleDate,
        date: moment(record.createdAt)
          .tz("Africa/Kampala")
          .format("MMMM Do YYYY, h:mm:ss a"),
      },
      message: "Thanks, your order was successfully sent.",
    });
  });
};

exports.getOrders = async function (req, res) {
  let orders = await OrderModel.find(req.query).populate({
    path: "user",
    select: "username phone",
  });
  res.json(orders);
};

exports.confirmOrder = async function (req, res, next) {
  let order = await OrderModel.findByIdAndUpdate(req.params.id, {
    status: "APPROVED",
    confirmedAt: new Date(),
  });

  let notification = await NotifyModel.create({
    user: order.user,
    order: order._id,
  });

  console.log("order", order);
  console.log(order.user);
  res.json(order);
};

exports.getOrder = async function (req, res, next) {
  let order = await OrderModel.findById(req.params.id);
  res.json(order);
};

exports.deleteOrder = async function (req, res, next) {
  let order = await OrderModel.findByIdAndDelete(req.params.id);
  res.json(order);
};