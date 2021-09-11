import React, { useState, useRef, useEffect } from "react";
import {
  Page,
  Navbar,
  Block,
  Button,
  Popup,
  NavRight,
  Link,
  BlockTitle,
  f7,
  ListInput,
  List,
  Icon,
  Fab,
  ListItem,
  Card,
} from "framework7-react";
import store from "../js/store";
import { selectMAPTOKEN, selectToken } from "../js/store_redux";
import { useSelector, useDispatch } from "react-redux";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import ReactMapboxAutocomplete from "../pages/autocomplete";
import DestinationAutoComplete from "../pages/destinationAutoCom";

export default function deliveryPopUp({ children }) {
  const [popupOpened, setPopupOpened] = useState(false);
  const popup = useRef(null);
  const [what, setWhat] = useState("");
  const [instructions, setInstructions] = useState("");
  const [recipient, setRecipient] = useState("");

  const [pickUpAddress, setPickUp] = useState({});
  const [destinationAddress, setDestination] = useState({});
  const [pickUpAddressName, setPickUpName] = useState("");
  const [destinationAddressName, setDestinationName] = useState("");
  const token = useSelector(selectToken);
  const MAP_TOKEN = useSelector(selectMAPTOKEN);
  const dispatch = useDispatch();

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const geocoderC = useRef(null);

  mapboxgl.accessToken = MAP_TOKEN;

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

  var currentMarkers = [];
  const marker1 = new mapboxgl.Marker();
  const suggestionSelectPickUp = async (result, lat, lng, text) => {
    console.log(result, lat, lng, text);
    setLng(lng);
    setLat(lat);

    setPickUpName(text);

    //set coords to be sent
    setPickUp({ lat: lat, lng: lng });

    // remove markers
    if (currentMarkers !== null) {
      console.log("marker found");
      console.log(currentMarkers);
      for (var i = currentMarkers.length - 1; i >= 0; i--) {
        currentMarkers[i].remove();
      }
    }

    marker1.setLngLat([lng, lat]).addTo(map.current);
    currentMarkers.push(marker1);

    setGeoLocLat(lng);
    await map.current.flyTo({ center: [lng, lat] });

    // console.log("seting done");
  };

  const suggestionSelectDest = async (result, lat, lng, text) => {
    console.log(result, lat, lng, text);
    setLng(lng);
    setLat(lat);

    setDestinationName(text);

    //set coords to be sent

    setDestination({ lat: lat, lng: lng });
    // console.log(destinationAddress, "dest");

    setGeoLocLat(lng);
    await map.current.flyTo({ center: [lng, lat] });
  };

  function submitOrder() {
    //  console.log('done')
    let order = {
      what,
      instructions,
      recipient,
      pickUpAddress,
      destinationAddress,
      pickUpAddressName,
      destinationAddressName,
    };

    f7.dialog.preloader("Processing order");

    f7.request({
      url: `${f7.store.state.API_URL}/delivery`,
      method: "POST",
      data: order,
      dataType: "json",
      headers: {
        // "x-mover-token": store.state.token
        "x-mover-token": token,
      },
    })
      .then((res) => {
        f7.dialog.close();
        setPopupOpened(false);
        f7.dialog.alert(res.data.message);

        dispatch({
          type: "deliveryOrders/add",
          payload: res.data.orderInfo,
        });

        console.log("added to store");
        // store.dispatch("saveDeliveryOrder", res.data.orderInfo);
        // f7router.refreshPage();
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
          <Navbar title="Delivery details">
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
              label="What do you what us to deliver?"
              type="text"
              floatingLabel
              outline
              // defaultValue="select shift type"
              placeholder="eg, food, clothes, scholastics..."
              onFocus={(e) => {
                e.target.value = "clothes";
                setWhat(e.target.value);
              }}
            ></ListInput>
            <ListInput
              label="Delivery Instructions"
              type="textarea"
              floatingLabel
              outline
              resizable={true}
              onFocus={(e) => {
                e.target.value = "Handle it with clear, very delicate";
                setInstructions(e.target.value);
              }}
            />
            <ListInput
              label="Recipient contant"
              floatingLabel
              outline
              onFocus={(e) => {
                e.target.value = "0751879095";
                setRecipient(e.target.value);
              }}
            />
            {/* <ListInput
              label="From"
              placeholder="Name of pickup"
              floatingLabel
              outline
              onFocus={(e) => {
                e.target.value = "Gulu";
                setPickUpAddress(e.target.value);
              }}
            /> */}

            <ReactMapboxAutocomplete
              onSuggestionSelect={suggestionSelectPickUp}
              onInputEmpty={() => {
                console.log("am empty");
              }}
              country="ug"
              resetSearch={false}
              country="ug"
              apiToken={MAP_TOKEN}
              label="Shifting from"
              type="text"
              placeholder="Name of place"
              clearButton
              floatingLabel
              outline
            />
            {/* <ListInput
              label="To"
              placeholder="Name of destination"
              floatingLabel
              outline
              onFocus={(e) => {
                e.target.value = "Kampala";
                setDestinationAddress(e.target.value);
              }}
            /> */}

            <DestinationAutoComplete
              onSuggestionSelect={suggestionSelectDest}
              country="ug"
              resetSearch={false}
              country="ug"
              apiToken={MAP_TOKEN}
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
          </List>
          <Card outline={true}>
            <div
              ref={mapContainer}
              className="map-container"
              style={{ height: 150 }}
            />
          </Card>
          <Fab
            position="center-bottom"
            slot="fixed"
            text="Proceed"
            onClick={submitOrder}
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
