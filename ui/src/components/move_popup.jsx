import {
  f7,
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
import React, { useRef, useState } from "react";
// import store from "../js/store";
// import Map from "./map";
import { useDispatch, useSelector } from "react-redux";
import { selectAPI_URL, selectToken } from "../js/store_redux";
import { submit } from "dom7";
import { store } from "../js/store_redux";

export default function movePopUp({ children }) {
  const [popupOpened, setPopupOpened] = useState(false);
  const popup = useRef(null);
  const [moveType, setMoveType] = useState("");
  const [pickUpAddress, setPickUp] = useState("");
  const [destinationAddress, setDestination] = useState("");
  const [shiftNeed, setShiftNeed] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");

  const dispatch = useDispatch();
  const API_URL = useSelector(selectAPI_URL);
  const token = useSelector(selectToken);

  function submitOrder() {
    //  console.log('done')
    // console.log(store.getState().token);
    let order = {
      moveType,
      pickUpAddress: { lat: "0.2924404", lng: "32.571751" },
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
