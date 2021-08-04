const express = require("express");
const router = express.Router();
const deliveryController = require("../../../controllers/delivery.controller");
const authMiddleWare = require("../../../middlewares/auth");

router.route("/").post(authMiddleWare, deliveryController.makeDeliveryOrder);

module.exports = router;
