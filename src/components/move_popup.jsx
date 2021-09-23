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
import { useDispatch, useSelector } from "react-redux";
import { selectAPI_URL, selectToken, selectMAPTOKEN } from "../js/store_redux";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxAutocomplete from "react-mapbox-autocomplete";
// var MapboxDirections = require("@mapbox/mapbox-gl-directions");
import ReactMapboxAutocomplete from "../pages/autocomplete";
import DestinationAutoComplete from "../pages/destinationAutoCom";
import config from "../config";

// mapboxgl.accessToken =
// "pk.eyJ1IjoibW92ZXJzIiwiYSI6ImNrdDVnbXp5ZDA4NmcycXFzMWtuamxuODQifQ.DlegQcTzXkX0yGEIO45vDQ";

export default function movePopUp({ children }) {
  const [popupOpened, setPopupOpened] = useState(false);
  const popup = useRef(null);
  const [moveType, setMoveType] = useState("");
  const [pickUpAddress, setPickUp] = useState({});
  const [destinationAddress, setDestination] = useState({});
  const [pickUpAddressName, setPickUpName] = useState("");
  const [destinationAddressName, setDestinationName] = useState("");
  const [shiftNeed, setShiftNeed] = useState("");
  const [scheduleDate, setScheduleDate] = useState(Date.now());
  const [scheduleTime, setScheduleTime] = useState("");
  const [geoloclat, setGeoLocLat] = useState("");
  const [geoloclng, setGeoLocLng] = useState("");
  const dispatch = useDispatch();
  const API_URL = useSelector(selectAPI_URL);
  const token = useSelector(selectToken);
  const MAP_TOKEN = useSelector(selectMAPTOKEN);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(13);
  const geocoderC = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [32.5825, 0.3476],
      zoom: zoom,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });

    const marker1 = new mapboxgl.Marker({
      // color: "#FFFFFF",
      // draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(map.current);

    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    );
  }, []);

  function submitOrder() {
    let order = {
      moveType,
      pickUpAddress,
      destinationAddress,
      pickUpAddressName,
      destinationAddressName,
      shiftNeed,
      scheduleDate,
      scheduleTime,
    };

    f7.dialog.preloader("Processing order");

    f7.request({
      // url: `${f7.store.state.API_URL}/orders`,
      url: `${config.API_URL}/client/v1/orders`,
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
        dispatch({ type: "moveOrders/add", payload: res.data.orderInfo });
      })
      .catch(function (e) {
        f7.dialog.close();
        f7.dialog.alert("something went wrong");
      });
  }
  var currentMarkers = [];
  const marker1 = new mapboxgl.Marker();
  const suggestionSelectPickUp = async (result, lat, lng, text) => {
    console.log(result, lat, lng, text);
    setLng(lng);
    setLat(lat);

    //set coords to be sent
    setPickUp({ lat: lat, lng: lng });
    setPickUpName(text);

    // remove markers
    if (currentMarkers !== null) {
      console.log("marker found"); // let obj = {
      //   k: "",
      //   r: 2,
      //   y: 3,
      // };
      // function isEmpty(obj) {
      //   console.log(Object.values(obj).some((element) => element == ""));
      //   return !Object.values(obj).some((element) => element !== null);
      // }

      // isEmpty(obj);
      console.log(currentMarkers);
      for (var i = currentMarkers.length - 1; i >= 0; i--) {
        currentMarkers[i].remove();
      }
    }

    marker1.setLngLat([lng, lat]).addTo(map.current);
    currentMarkers.push(marker1);

    setGeoLocLat(lng);
    await map.current.flyTo({ center: [lng, lat] });

    console.log("seting done");
  };

  const suggestionSelectDest = async (result, lat, lng, text) => {
    console.log(result, lat, lng, text);
    setLng(lng);
    setLat(lat);

    //set coords to be sent

    setDestination({ lat: lat, lng: lng });
    setDestinationName(text);
    // console.log(destinationAddress, "dest");

    setGeoLocLat(lng);
    await map.current.flyTo({ center: [lng, lat] });
  };

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

          <List form style={{ marginTop: 5, marginBottom: 5 }}>
            <ListInput
              label="Move type"
              type="select"
              placeholder="Please choose..."
              onChange={(e) => {
                console.log(e.target.value);
                setMoveType(e.target.value);
              }}
              required={true}
              outline
            >
              <option value="null">select move type...</option>
              <option value="Within Kampala">Within Kampala</option>
              <option value="Outside Kampala">Outside Kampala</option>
            </ListInput>
            <ReactMapboxAutocomplete
              onSuggestionSelect={suggestionSelectPickUp}
              onInputEmpty={() => {
                console.log("am empty");
              }}
              country="ug"
              resetSearch={false}
              country="ug"
              // apiToken={MAP_TOKEN}
              apiToken={config.MAP_TOKEN}
              label="Shifting from"
              type="text"
              placeholder="Name of place"
              clearButton
              floatingLabel
              outline
            />
            {/* <ReactMapboxAutocomplete
              onSuggestionSelect={suggestionSelect}
              country="ug"
              resetSearch={false}
              country="ug"
              // apiToken="pk.eyJ1IjoibW92ZXJzIiwiYSI6ImNrdDVnbXp5ZDA4NmcycXFzMWtuamxuODQifQ.DlegQcTzXkX0yGEIO45vDQ"
              label="To"
              type="text"
              placeholder="shifting to?"
              clearButton
              floatingLabel
              outline
              onInputEmpty={() => {
                console.log("destination");
                marker1.remove();
                console.log("removed");
              }}
            /> */}

            <DestinationAutoComplete
              onSuggestionSelect={suggestionSelectDest}
              country="ug"
              resetSearch={false}
              country="ug"
              // apiToken={MAP_TOKEN}
              apiToken={config.MAP_TOKEN}
              label="To"
              type="text"
              placeholder="shifting to?"
              clearButton
              floatingLabel
              outline
              onInputEmpty={() => {
                console.log("destination");
                marker1.remove();
                console.log("removed");
              }}
            />
            {/* </ListItem> */}

            {/* <ListInput
              label="To"
              type="text"
              placeholder="shifting to?"
              clearButton
              floatingLabel
              outline
              onInput={(e) => {
                setDestination(e.target.value);
              }}
            ></ListInput> */}
            <ListInput
              label="Schedule Date"
              type="date"
              // type="datetime-local"
              // timePicker
              defaultValue={scheduleDate}
              placeholder="Please choose..."
              onInput={(e) => {
                console.log(e.target.value);
                setScheduleDate(e.target.value);
              }}
              required={true}
              outline
            />
            <ListInput
              label="Schedule Time"
              type="time"
              // type="datetime-local"
              // timePicker
              // defaultValue="2014-04-30"
              placeholder="Please choose..."
              onInput={(e) => {
                console.log(e.target.value);
                setScheduleTime(e.target.value);
              }}
              outline
              required={true}
            />
            {/* <ListInput
              label="test"
              type="text"
              // type="datetime-local"
              // timePicker
              // defaultValue="2014-04-30"
              placeholder="Please choose..."
              onInput={(e) => {
                console.log(e.target.value);
                setScheduleTime(e.target.value);
              }}
              outline
              onInputEmpty={() => {
                console.log("input cleard");
              }}
            /> */}

            <ListItem
              title="Select shifting need"
              smartSelect
              smartSelectParams={{
                openIn: "popover",
                closeOnSelect: true,
              }}
              outline
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

          <Card outline={true}>
            <div
              ref={mapContainer}
              className="map-container"
              // style={{ height: 150 }}
              style={{ height: 150, width: "100%" }}
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
