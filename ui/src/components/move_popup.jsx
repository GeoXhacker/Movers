import {
  Button,
  f7,
  Card,
  Fab,
  Icon,
  Link,
  List,
  ListInput,
  ListItem,
  Navbar,
  NavRight,
  Page,
  Popup,
} from "framework7-react";
import React, { useRef, useState, useEffect } from "react";
// import store from "../js/store";
// import Map from "./map";
import { useDispatch, useSelector } from "react-redux";
import { selectAPI_URL, selectToken } from "../js/store_redux";
import { store } from "../js/store_redux";
// var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

// mapboxgl.accessToken =
//   "pk.eyJ1IjoibW92ZXJzIiwiYSI6ImNrdDVnbXp5ZDA4NmcycXFzMWtuamxuODQifQ.DlegQcTzXkX0yGEIO45vDQ";
// var map = new mapboxgl.Map({
//   container: "map",
//   style: "mapbox://styles/mapbox/streets-v11",
// });

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
// import "./map.css";

// import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  "pk.eyJ1IjoibW92ZXJzIiwiYSI6ImNrdDVnbXp5ZDA4NmcycXFzMWtuamxuODQifQ.DlegQcTzXkX0yGEIO45vDQ";

export default function movePopUp({ children }) {
  const [popupOpened, setPopupOpened] = useState(false);
  const popup = useRef(null);
  const [moveType, setMoveType] = useState("");
  const [pickUpAddress, setPickUp] = useState("");
  const [destinationAddress, setDestination] = useState("");
  const [shiftNeed, setShiftNeed] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [geoloclat, setGeoLocLat] = useState("");
  const [geoloclng, setGeoLocLng] = useState("");

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    console.log(map, "cur");
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [32.5825, 0.3476],
      zoom: zoom,
    });

    //  const marker1 = new mapboxgl.Marker({
    //    // color: "#FFFFFF",
    //    // draggable: true,
    //  })
    //    .setLngLat(userLoc)
    //    .addTo(map.current);

    // const marker2 = new mapboxgl.Marker({
    //   // color: "#FFFFFF",
    //   // draggable: true,
    // })
    //   .setLngLat([32.5645, 0.3665])
    //   .addTo(map.current);

    // map.current.addControl(
    //   new MapboxGeocoder({
    //     accessToken: mapboxgl.accessToken,
    //     mapboxgl: mapboxgl,
    //     autocomplete: true,
    //     countries: "ug",
    //   })
    // );
    // getLoc();
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const dispatch = useDispatch();
  const API_URL = useSelector(selectAPI_URL);
  const token = useSelector(selectToken);

  const getLoc = () => {
    if (window.navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      function success(pos) {
        const crd = pos.coords;
        setGeoLocLat(crd.latitude);
        setGeoLocLng(crd.longitude);
        // dispatch({type: 'USER_LOC', payload:{lng: }})
        // console.log("Your current position is:");
        // console.log(`Latitude : ${crd.latitude}`);
        // console.log(`Longitude: ${crd.longitude}`);
        // console.log(`More or less ${crd.accuracy} meters.`);
      }

      function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      window.navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            // If granted then you can directly call your function here
            window.navigator.geolocation.getCurrentPosition(success);
          } else if (result.state === "prompt") {
            window.navigator.geolocation.getCurrentPosition(
              success,
              errors,
              options
            );
          } else if (result.state === "denied") {
            // If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    } else {
      alert("Sorry Not available!");
    }
  };

  function submitOrder() {
    //  console.log('done')
    // console.log(store.getState().token);
    let order = {
      moveType,
      // pickUpAddress: { lat: geoloclat, lng: geoloclng },
      pickUpAddress: { lat: "0.27701", lng: "32.3556" },
      destinationAddress: { lat: "0.2890523", lng: "32.5672294" },
      shiftNeed,
      scheduleDate,
    };

    // setTimeout(f7.dialog.preloader("Processing order"), 3000)
    f7.dialog.preloader("Processing order");

    f7.request({
      // url: `${f7.store.state.API_URL}/orders`,
      url: `${API_URL}/orders`,
      method: "POST",
      data: order,
      dataType: "json",
      headers: {
        "x-mover-token": token,
      },
    })
      .then((res) => {
        f7.dialog.close();
        setPopupOpened(false);
        f7.dialog.alert(res.data.message);
        // store.dispatch("saveMoveOrder", res.data.orderInfo);
        dispatch({ type: "moveOrders/add", payload: res.data.orderInfo });
      })
      .catch(function (e) {
        f7.dialog.close();
        f7.dialog.alert("something went wrong");
      });
  }

  return (
    <>
      {React.cloneElement(children, {
        onClick: function (e) {
          setPopupOpened(true);
        },
      })}
      <Popup
        className="demo-popup"
        opened={popupOpened}
        onPopupClosed={() => setPopupOpened(false)}
      >
        <Page>
          <Navbar title="Moving details">
            <NavRight>
              <Link
                iconIos="f7:multiply"
                iconAurora="f7:menu"
                iconMd="material:close"
                popupClose
              />
            </NavRight>
          </Navbar>
          {/* content */}

          <List form>
            <ListInput
              label="Move type"
              type="select"
              // defaultValue="select shift type"
              placeholder="Please choose..."
              onChange={(e) => {
                console.log(e.target.value);
                setMoveType(e.target.value);
              }}
            >
              <option value="null">select move type...</option>
              <option value="Within Kampala">Within Kampala</option>
              <option value="Outside Kampala">Outside Kampala</option>
            </ListInput>
            <ListInput
              label="Shifting from"
              type="text"
              placeholder="Name of place"
              clearButton
              floatingLabel
              outline
              onInput={(e) => {
                setPickUp(e.target.value);
              }}
            ></ListInput>
            <ListItem>
              {/* <p>{`${geoloclat}, ${geoloclng}`}</p> */}
              <Button onClick={getLoc}>mark my location</Button>
            </ListItem>

            <ListInput
              label="To"
              type="text"
              placeholder="shifting to?"
              clearButton
              floatingLabel
              outline
              onInput={(e) => {
                setDestination(e.target.value);
              }}
            ></ListInput>
            {/* <ListInput
              calendarParams={{
                timePicker: true,
                openIn: "popup",
                header: true,
                headerPlaceholder: "Shifting time",
                closeOnSelect: true,
                dateFormat: "dd-mm-yyyy hh::mm A",
              }}
              label="Date time"
              type="datepicker"
              placeholder="Please choose..."
              floatingLabel
              outline
              calendarChange={(value) => console.log(value)}
            ></ListInput> */}
            <ListInput
              label="Schedule"
              type="date"
              placeholder="Please choose..."
              onInput={(e) => {
                setScheduleDate(e.target.value);
              }}
            ></ListInput>
            <ListItem
              title="Select shifting need"
              smartSelect
              smartSelectParams={{
                openIn: "popover",
                closeOnSelect: true,
              }}
            >
              <select
                name="shiftNeed"
                multiple={false}
                floatingLabel
                outline
                onChange={(e) => {
                  setShiftNeed(e.target.value);
                }}
              >
                <option value="choose">choose your need</option>
                <option value="Few items">Few items</option>
                <option value="1 room">1 room</option>
                <option value="2 rooms">2 rooms</option>
                <option value="3 rooms">3 rooms and above</option>
                <option value="Office">Office</option>
                <option value="Others">Others</option>
              </select>
            </ListItem>
          </List>
          {/* <Map /> */}
          <div id="map"></div>
          <Card outline={true}>
            {/* <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div> */}
            <div
              ref={mapContainer}
              className="map-container"
              style={{ height: 200 }}
            />
          </Card>

          <Fab
            position="center-bottom"
            slot="fixed"
            text="Proceed"
            onClick={() => submitOrder()}
            submit
          >
            <Icon
              ios="f7:chevron_right_2"
              aurora="f7:chevron_right_2"
              md="material:forward"
            ></Icon>
          </Fab>
        </Page>
      </Popup>
    </>
  );
}
