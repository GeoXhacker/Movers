import { createStore } from "framework7/lite";

const store = createStore({
  state: {
    API_URL: "/client/v1",
    token: localStorage.getItem("x-mover-token"),
    moveOrders: JSON.parse(localStorage.getItem("moveOrders") || "[]"),
    deliveryOrders: JSON.parse(localStorage.getItem("deliveryOrders") || "[]"),
    userLoc: [0, 0],
  },
  getters: {
    token({ state }) {
      return state.token;
    },
    moveOrders({ state }) {
      return state.moveOrders;
    },
    API_URL({ state }) {
      return state.API_URL;
    },
  },
  actions: {
    setToken({ state }, token) {
      state.token = token;
      localStorage.setItem("x-mover-token", token);
    },
    saveMoveOrder({ state }, order) {
      let orders = state.moveOrders;
      orders.push(order);
      localStorage.setItem("moveOrders", JSON.stringify(orders));
    },
    saveDeliveryOrder({ state }, order) {
      let orders = state.deliveryOrders;
      orders.push(order);
      localStorage.setItem("deliveryOrders", JSON.stringify(orders));
    },
    // setUserLoc({})
  },
});

export default store;
