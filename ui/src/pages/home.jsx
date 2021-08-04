import {
  Block,
  BlockTitle,
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
import React from "react";
import Swiper from "react-id-swiper";
import { useDispatch } from "react-redux";
import MovePopup from "../components/move_popup";
import PackagePopup from "../components/package_popup";

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

const HomePage = ({ f7router }) => {
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
    </Page>
  );
};
export default HomePage;
