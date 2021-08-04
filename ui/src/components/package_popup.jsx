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
} from "framework7-react";
import store from "../js/store";
import { selectToken } from "../js/store_redux";
import { useSelector, useDispatch } from "react-redux";

export default function deliveryPopUp({ children }) {
  const [popupOpened, setPopupOpened] = useState(false);
  const popup = useRef(null);
  const [what, setWhat] = useState("");
  const [instructions, setInstructions] = useState("");
  const [recipient, setRecipient] = useState("");
  const [pickUpAddress, setPickUpAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  function submitOrder() {
    //  console.log('done')
    let order = {
      what,
      instructions,
      recipient,
      pickUpAddress: { lat: "0.2924404", lng: "32.571751" },
      destinationAddress: { lat: "0.2890523", lng: "32.5672294" },
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
            <ListInput
              label="From"
              placeholder="Name of pickup"
              floatingLabel
              outline
              onFocus={(e) => {
                e.target.value = "Gulu";
                setPickUpAddress(e.target.value);
              }}
            />
            <ListInput
              label="To"
              placeholder="Name of destination"
              floatingLabel
              outline
              onFocus={(e) => {
                e.target.value = "Kampala";
                setDestinationAddress(e.target.value);
              }}
            />
          </List>
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
