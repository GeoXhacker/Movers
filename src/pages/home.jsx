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
import { useDispatch, useSelector } from "react-redux";
import MovePopup from "../components/move_popup";
import PackagePopup from "../components/package_popup";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";

// import "./map.css";

// import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import ReactMapboxAutocomplete from "./autocomplete";
import { selectMAPTOKEN, selectToken } from "../js/store_redux";
// var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
// var MapboxDirections = require("@mapbox/mapbox-gl-directions");
// import { MapboxDirections } from "@mapbox/mapbox-gl-directions";

mapboxgl.accessToken =
  "pk.eyJ1IjoibW92ZXJzIiwiYSI6ImNrdDVnbXp5ZDA4NmcycXFzMWtuamxuODQifQ.DlegQcTzXkX0yGEIO45vDQ";

const params = {
  spaceBetween: 30,
  centeredSlides: true,
  lazy: true,
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
  const [barners, setBarners] = useState([]);
  const MAP_TOKEN = useSelector(selectToken);
  const token = useSelector(selectToken);

  const getBanners = () => {
    f7.request({
      url: `${process.env.MOVERS_HOST}/api/v1/browse/attachments?role=banner`,
      method: "GET",
      headers: {
        "X-Access-Token": token,
      },
      dataType: "json",
    }).then((res) => {
      setBarners(res.data.items);
    });
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [32.5825, 0.3476],
      zoom: zoom,
    });

    map.current.addControl(
      new mapboxgl.AttributionControl({
        customAttribution: "Movers",
      })
    );

    const marker1 = new mapboxgl.Marker({
      // color: "#FFFFFF",
      // draggable: true,
    })
      .setLngLat([32.5934603903443, 0.333278013367931])
      .addTo(map.current);

    getBanners();
  }, []);

  let dispatch = useDispatch();
  function logOut(f7router) {
    dispatch({ type: "moveOrders/deleteAll" });
    dispatch({ type: "deliveryOrders/deleteAll" });
    dispatch({ type: "logOut" });
    f7.dialog.alert("Thank you for using Movers");
    f7router.refreshPage();
  }
  console.log(process.env.MAP_TOKEN);

  const banners = ["banner1.jpg", "banner2.jpg", "banner3.jpeg"];

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
        <Swiper>
          {barners.length
            ? barners.map(({ _id }, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`${process.env.MOVERS_HOST}/api/v1/attachment/${_id}`}
                    style={{ width: "100%", height: 180 }}
                  />
                </SwiperSlide>
              ))
            : banners.map((banner, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={`../static/${banner}`}
                    style={{ width: "100%", height: 180 }}
                  />
                </SwiperSlide>
              ))}
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
      <Card outline={true}>
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
