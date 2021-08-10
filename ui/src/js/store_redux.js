//1. import redux store;
import { createStore } from "redux";
// for state persistance after refresh
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

//2.figure out the blue print for ur state
export const initialState = {
  number: 25,
  API_URL: "/api/v1",
  token: "",
  moveOrders: [],
  deliveryOrders: [],
  user: {},
  n: 1,
  test: 30,
  socket: 0,
};
// 3.create a reducer function; that is gonna make the logic behind user actions
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "token/setToken":
      return { ...state, token: action.payload };

    case "moveOrders/add":
      return { ...state, moveOrders: [...state.moveOrders, action.payload] }; //payload is an obj

    case "serverMoveOrders/add":
      return {
        ...state,
        moveOrders: [...state.moveOrders].concat(action.payload),
      };

    case "moveOrders/deleteAll":
      return { ...state, moveOrders: [] };

    case "deliveryOrders/add":
      return {
        ...state,
        deliveryOrders: [...state.deliveryOrders, action.payload],
      };
    case "deliveryOrders/deleteAll":
      return { ...state, deliveryOrders: [] };

    case "user/addInfo":
      return { ...state, user: action.payload };

    case "logOut":
      return { ...state, token: "" };
    // case "updateStatus":
    //   return {
    //     ...state,
    //     moveOrders: state.moveOrders.map((order) =>
    //       order._id === action.payload
    //         ? { ...order, status: "APPROVED" }
    //         : order
    //     ),
    //   };
    case "updateStatus":
      return {
        ...state,
        moveOrders: state.moveOrders.map((order) =>
          order.id === action.payload.id
            ? { ...order, status: action.payload.status }
            : order
        ),
        socket: state.socket++,
      };

    case "number/add": //naming convension name of slice followed by what its gon do
      return { ...state, number: state.number + 1 }; // what to do on dispatching action to store; ensure that u dont change the state directly; make a copy and modify that

    case "test/add":
      return { ...state, test: state.n + 1 };

    default:
      return state;
  }
};

// const reducer = combineReducers({ reduxReducer, b2Reducer });

// persist storage
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

//  SELECTORS
export const selectNumber = (state) => {
  return state.number;
};

export const selectSocket = (state) => {
  return state.socket;
};
export const selectMoveOrders = (state) => {
  return state.moveOrders;
};

export const selectDeliveryOrders = (state) => {
  return state.deliveryOrders;
};

export const selectToken = (state) => {
  return state.token;
};

export const selectAPI_URL = (state) => {
  return state.API_URL;
};

export const selectUser = (state) => {
  return state.user;
};

export const selectRedux = (state) => {
  return state.reduxReducer.number;
};
