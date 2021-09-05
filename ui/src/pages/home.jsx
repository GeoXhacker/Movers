import {
  Block,
  BlockTitle,
  Button,
  Card,
  Col,
  f7,
  Link,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
  Row,
} from "framework7-react";
import React, { useRef, useEffect, useState } from "react";
import Swiper from "react-id-swiper";
import { useDispatch } from "react-redux";
import MovePopup from "../components/move_popup";
import PackagePopup from "../components/package_popup";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
// import "./map.css";

// import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
// var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
// var MapboxDirections = require("@mapbox/mapbox-gl-directions");
// import { MapboxDirections } from "@mapbox/mapbox-gl-directions";

mapboxgl.accessToken =
  "pk.eyJ1IjoibW92ZXJzIiwiYSI6ImNrdDVnbXp5ZDA4NmcycXFzMWtuamxuODQifQ.DlegQcTzXkX0yGEIO45vDQ";

const params = {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  // pagination: {
  //   el: '.swiper-pagination',
  //   clickable: true
  // },
  // navigation: {
  //   nextEl: '.swiper-button-next',
  //   prevEl: '.swiper-button-prev'
  // }
};
// const Map = ReactMapboxGl({
//   accessToken:
//     "pk.eyJ1IjoibW92ZXJzIiwiYSI6ImNrdDVnbXp5ZDA4NmcycXFzMWtuamxuODQifQ.DlegQcTzXkX0yGEIO45vDQ",
// });

const HomePage = ({ f7router }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(13);
  const [userLoc, setUserLoc] = useState([0, 0]);

  const getLoc = () => {
    let pos = window.navigator.geolocation.getCurrentPosition((pos) => {
      console.log("pos", pos);
      setUserLoc([pos.coords.longitude, pos.coords.latitude]);
    });
  };

  useEffect(() => {
    console.log(map, "cur");
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [32.5825, 0.3476],
      zoom: zoom,
    });

    const marker1 = new mapboxgl.Marker({
      // color: "#FFFFFF",
      // draggable: true,
    })
      .setLngLat([32.4567, 0.2222])
      .addTo(map.current);

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

  // var directions = new MapboxDirections({
  //   accessToken: "YOUR-MAPBOX-ACCESS-TOKEN",
  //   unit: "metric",
  //   profile: "mapbox/driving",
  // });

  // map.current.addControl(directions, "top-left");

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  let dispatch = useDispatch();
  function logOut(f7router) {
    // localStorage.setItem("x-mover-token", "");
    // localStorage.setItem(
    //   "user",
    //   JSON.stringify({ username: "username", phone: "07xxxxxxxx" })
    // );
    // localStorage.setItem('orders', '[]')
    dispatch({ type: "moveOrders/deleteAll" });
    dispatch({ type: "deliveryOrders/deleteAll" });
    dispatch({ type: "logOut" });
    f7.dialog.alert("Thank you for using Movers");
    f7router.refreshPage();
  }
  return (
    <Page name="home">
      {/* Top Navbar */}
      <Navbar sliding={false}>
        <NavLeft>
          <Link
            iconIos="f7:menu"
            iconAurora="f7:menu"
            iconMd="material:menu"
            panelOpen="left"
          />
        </NavLeft>
        <NavTitle sliding>Movers</NavTitle>
        <NavRight>
          <Link
            iconIos="f7:square_arrow_right"
            iconAurora="f7:square_arrow_right"
            iconMd="material:exit_to_app"
            onClick={() => {
              logOut(f7router);
            }}
          />

          {/* <Icon iconMd='material:menu' size='30px' color='purple' onClick={() => {logOut()}}></Icon> */}
        </NavRight>
      </Navbar>

      {/* Page content */}
      <Block>
        <Swiper {...params}>
          <div>
            <img
              data-src="static/banner1.jpg"
              style={{ width: "100%", height: 180 }}
              className="lazy"
            />
          </div>

          <div>
            <img
              data-src="static/banner3.jpeg"
              style={{ width: "100%", height: 180 }}
              className="lazy"
            />
          </div>

          <div>
            <img
              data-src="static/banner2.jpg"
              style={{ width: "100%", height: 180 }}
              className="lazy"
            />
          </div>
        </Swiper>
      </Block>
      <BlockTitle>Select Service</BlockTitle>
      <Block>
        <Row>
          <Col>
            <Card
              outline
              title={<span style={{ fontSize: 15 }}>Package Delivery</span>}
              content={
                <center>
                  <PackagePopup>
                    <img
                      src="/static/icons/delivery-man.png"
                      style={{ width: 48, height: 48 }}
                    />
                  </PackagePopup>
                </center>
              }
              style={{ height: 150 }}
            ></Card>
          </Col>
          <Col>
            <Card
              outline
              title={<span style={{ fontSize: 15 }}>Moving</span>}
              content={
                <center>
                  <MovePopup>
                    <img
                      src="/static/icons/truck.png"
                      style={{ width: 48, height: 48, alignItems: "center" }}
                    />
                  </MovePopup>
                </center>
              }
              style={{ height: 150 }}
            ></Card>
          </Col>
        </Row>
      </Block>
      {/* <Button onClick={getLoc}>get loc</Button> */}
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
    </Page>
  );
};
export default HomePage;
