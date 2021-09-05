// Import React and ReactDOM
// Import Framework7-React Plugin
import Framework7React from "framework7-react";
// Import Framework7 Styles
import "framework7/framework7-bundle.css";
// Import Framework7
import Framework7 from "framework7/lite-bundle";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux"; //react redux...
//Persistence storage with redux
import { PersistGate } from "redux-persist/integration/react";
import App from "../components/app.jsx";
import "../css/app.css";
// Import Icons and App Custom Styles
import "../css/icons.css";
// import { store } from "./store_redux";
import { persistor, store } from "./store_redux";

import "mapbox-gl/dist/mapbox-gl.css";

// import "../pages/map.css";

// Init F7 React Plugin
Framework7.use(Framework7React);

Framework7.request.setup({
  headers: {
    Authorization: "sometokenvalue",
  },
});

// Mount React App
// const render = () => {
ReactDOM.render(
  // React.createElement(App)
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* <Redux /> */}
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("app")
);
// };

// render();
// store.subscribe(render);
