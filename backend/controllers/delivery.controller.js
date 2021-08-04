const DeliveryModel = require("../models/delivery");
const xtend = require("xtend");
const moment = require("moment");
const { latLonToPlace } = require("../utils/geoplugin");

exports.makeDeliveryOrder = async function (req, res, next) {
  // console.log(req.user)

  // console.log(packageOrder)

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

  const packageData = xtend(req.body, {
    user: req.user.id,
    destinationAddressName: destinationAddress.geoplugin_place,
    pickUpAddressName: pickUpAddress.geoplugin_place,
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
        date: record.createdAt,
      },
      message: "Thanks, your order was successfully sent.",
    });
    console.log(packageOrder, "order dispatched to frontend");
  });
};
