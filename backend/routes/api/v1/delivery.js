const express = require("express");
const router = express.Router();
const deliveryController = require("../../../controllers/delivery.controller");
const authMiddleWare = require("../../../middlewares/auth");

router
  .route("/")
  .post(authMiddleWare, deliveryController.makeDeliveryOrder)
  .get(deliveryController.getOrders);

router
  .route("/:id")
  .get(deliveryController.getOrder)
  .delete(deliveryController.deleteOrder)
  .put(deliveryController.confirmOrder);

module.exports = router;
