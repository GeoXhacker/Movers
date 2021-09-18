import {
  App,
  f7,
  f7ready,
  Link,
  List,
  ListItem,
  Navbar,
  Page,
  Panel,
  Toolbar,
  View,
  Views,
} from "framework7-react";
import { getDevice } from "framework7/lite-bundle";
import React, { useEffect, useState, useRef } from "react";
import cordovaApp from "../js/cordova-app";
import routes from "../js/routes";
import store from "../js/store";
import socket from "../js/socket";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSocket,
  selectMoveOrders,
  selectToken,
  selectDeliveryOrders,
} from "../js/store_redux";

// import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

// mapboxgl.accessToken =
//   "pk.eyJ1IjoibW92ZXJzIiwiYSI6ImNrdDVnbXp5ZDA4NmcycXFzMWtuamxuODQifQ.DlegQcTzXkX0yGEIO45vDQ";

const MyApp = () => {
  const token = useSelector(selectToken);
  const moveOrders = useSelector(selectMoveOrders);
  const deliveryOrders = useSelector(selectDeliveryOrders);
  const socketCount = useSelector(selectSocket);
  const dispatch = useDispatch();
  // Login screen demo data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const device = getDevice();

  // useEffect(() => {
  //   if (token) {
  //     let conn = socket.connect(f7, token);
  //     conn.on("notifications", (doc) => {
  //       console.log("update", doc);

  //       moveOrders.filter((order) =>
  //         doc.some((update) => {
  //           if (order.id === update.order) {
  //             console.log(order, update);
  //             console.log("starting dispatch");

  //             dispatch({
  //               type: "updateStatus",
  //               payload: {
  //                 id: update.order,
  //                 status: update.status,
  //               },
  //             });
  //             console.log("dispatched");
  //             // conn.emit("checkDb", doc);
  //           }
  //         })
  //       );
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (token) {
      let conn = socket.connect(f7, token);
      conn.on("notifications", (doc) => {
        // console.log("update", doc);
      });

      conn.on("doc", (doc) => {
        // console.log(doc, "notification");
      });

      // conn.on("check", (e) => {
      //   console.log(e);
      // });
      // conn.io.on("reconnect", (e) => {
      //   console.log(e, "reconnect");

      //   conn.emit("reconnected", "hi", "how");
      //   console.log(e, "reconnectd");
      // });

      conn.on("test", (data) => {
        // console.log("socket", data);
        // console.log("start dispatch");
        dispatch({
          type: "updateStatus",
          payload: { id: data.order, status: data.status },
        });

        f7.dialog.alert("Your Order has been approved");

        // console.log("dispatched");
      }); // conn.on("check", (e) => {
      //   console.log(e);
      // });
    }
  }, []);

  // Framework7 Parameters

  const f7params = {
    name: "Movers", // App name
    theme: "auto", // Automatic theme detection

    id: "com.koodeyo.movers", // App bundle ID
    // App store
    store: store,
    // App routes
    routes: routes,

    // Input profile
    input: {
      scrollIntoViewOnFocus: device.cordova && !device.electron,
      scrollIntoViewCentered: device.cordova && !device.electron,
    },
    // Cordova Statusbar profile
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  };
  const alertLoginData = () => {
    f7.dialog.alert(
      "Username: " + username + "<br>Password: " + password,
      () => {
        f7.loginScreen.close();
      }
    );
  };

  f7ready(() => {
    // Init cordova APIs (see cordova-app.js)
    if (f7.device.cordova) {
      cordovaApp.init(f7);
    }

    // if (token) {
    //   let conn = socket.connect(f7, token);
    //   conn.on("notifications", (doc) => {
    //     console.log("update", doc);

    //     moveOrders.filter((order) =>
    //       doc.some((update) => {
    //         if (order.id === update.order) {
    //           console.log(order, update);
    //           console.log("starting dispatch");

    //           dispatch({
    //             type: "updateStatus",
    //             payload: {
    //               id: update.order,
    //               status: update.status,
    //             },
    //           });
    //           console.log("dispatched");
    //           // conn.emit("checkDb", doc);
    //         }
    //       })
    //     );
    //   });
    // }
    // f7.sockect.on('notifications', ())

    // Call F7 APIs here
  });

  return (
    <App {...f7params} themeDark={false}>
      {/* Left panel with cover effect*/}
      <Panel left cover>
        <View>
          <Page>
            <Navbar title="About us" />
            <List>
              <ListItem>
                We are a domestic moving company. Our services also include
                package delivery and long-distance relocations. We cover several
                cities of our nation Uganda. If you’re in need of a moving
                quote, please feel free to contact us anytime. We can schedule
                an appointment to do an in-home walkthrough or virtual survey.
                Our goal is that you’re pleased with the outcome of your move.
                Thank you for choosing us.
              </ListItem>
            </List>
          </Page>
        </View>
      </Panel>

      {/* Views/Tabs container */}
      <Views tabs className="safe-areas">
        {/* Tabbar for switching views-tabs */}
        <Toolbar tabbar labels bottom>
          <Link
            tabLink="#view-home"
            tabLinkActive
            iconIos="f7:house_fill"
            iconAurora="f7:house_fill"
            iconMd="material:home"
            text="Home"
          />
          <Link
            tabLink="#view-history"
            iconIos="f7:square_list_fill"
            iconAurora="f7:square_list_fill"
            iconMd="material:view_list"
            text="History"
          />
          <Link
            tabLink="#view-profile"
            iconIos="f7:person_fill"
            iconAurora="f7:person_fill"
            iconMd="material:perm_identity"
            text="Profile"
          />
        </Toolbar>

        {/* Your main view/tab, should have "view-main" class. It also has "tabActive" prop */}
        <View id="view-home" main tab tabActive url="/" />

        {/* history View */}
        <View id="view-history" name="history" tab url="/history/" />

        {/* profile View */}
        <View id="view-profile" name="profile" tab url="/profile/" />
      </Views>
    </App>
  );
};
export default MyApp;
