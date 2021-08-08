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
import React, { useState } from "react";
import cordovaApp from "../js/cordova-app";
import routes from "../js/routes";
import store from "../js/store";
import socket from "../js/socket";
import { useSelector, useDispatch } from "react-redux";
import { selectMoveOrders, selectToken } from "../js/store_redux";

const MyApp = () => {
  const token = useSelector(selectToken);
  const moveOrders = useSelector(selectMoveOrders);
  const dispatch = useDispatch();
  // Login screen demo data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const device = getDevice();
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

    if (token) {
      let conn = socket.connect(f7, token);
      const objectsEqual = (o1, o2) =>
        typeof o1 === "object" && Object.keys(o1).length > 0
          ? Object.keys(o1).length === Object.keys(o2).length &&
            Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
          : o1 === o2;

      const arraysEqual = (a1, a2) =>
        a1.length === a2.length &&
        a1.every((o, idx) => objectsEqual(o, a2[idx]));

      conn.on("notifications", (doc) => {
        // console.log(moveOrders);
        console.log("update", doc);
        let doc2 = doc.map((e) => e);
        console.log(doc2);

       

        // let intersection =

        // moveOrders.filter((order) =>
        //   doc.some((update) => {
        //     if (order.id === update.order) {
        //       console.log(order, update);
        //       console.log("starting dispatch");

        //       // dispatch({
        //       //   type: "updateStatus",
        //       //   payload: {
        //       //     id: update.id,
        //       //     status: update.status,
        //       //   },
        //       // });
        //       // console.log("dispatched");
        //     } else console.log("no updates for", order);
        //   })
        // );
        // console.log("intersection", intersection);

        // for (let i = 0; i < doc.length; i++) {
        //   const update = doc[i];
        //   console.log(update);
        //   const orderTobeUpdated = moveOrders.find((e) => e.id === update.order);
        //   if (orderTobeUpdated) {
        //     console.log("found", orderTobeUpdated);
        //     dispatch({
        //       type: "updateStatus",
        //       payload: {
        //         id: update.order,
        //         status: update.status,
        //       },
        //     });
        //     console.log("status updated");
        //   }
        // }
      });
    }

    // f7.sockect.on('notifications', ())

    // Call F7 APIs here
  });

  return (
    <App {...f7params} themeDark={false}>
      {/* Left panel with cover effect*/}
      <Panel left cover>
        <View>
          <Page>
            <Navbar title="Left Panel" />
            <List>
              <ListItem>this is </ListItem>
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
