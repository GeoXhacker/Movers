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
import { useSelector } from "react-redux";
import { selectToken } from "../js/store_redux";

const MyApp = () => {
  const token = useSelector(selectToken);
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
      socket.connect(f7, token);
    }

    // setTimeout(() => {
    //   f7.socket.emit("token", "00888888");
    // }, 9000);
    // MqttClient.connect(f7);

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
