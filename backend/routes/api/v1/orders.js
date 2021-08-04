const express = require("express");
const router = express.Router();
const orderController = require("../../../controllers/orders.controller");
const authMiddleWare = require("../../../middlewares/auth");

router
  .route("/")
  .post(authMiddleWare, orderController.makeOrder)
  .get(orderController.getOrders);

router
  .route("/:id")
  .get(orderController.getOrder)
  .delete(orderController.deleteOrder)
  .put(orderController.confirmOrder);

module.exports = router;
