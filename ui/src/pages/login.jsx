import {
  BlockFooter,
  f7,
  List,
  ListButton,
  ListInput,
  LoginScreenTitle,
  Page,
} from "framework7-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAPI_URL, selectMoveOrders } from "../js/store_redux";

export default ({ f7router }) => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  const dispatch = useDispatch();
  const API_URL = useSelector(selectAPI_URL);
  const orders = useSelector(selectMoveOrders);

  const confirmPhone = () => {
    f7.dialog.prompt(
      `Please enter the 6-digit code sent to ${phone}`,
      "Confirm",
      function (code) {
        f7.request
          .json(`${API_URL}/auth/verify/${phone}/${code}`)
          // .json(`${f7.store.state.API_URL}/auth/verify/${phone}/${code}`)
          .then(function (res) {
            let token = res.data.token;
            // console.log(res.data.deliveryOrders);
            dispatch({ type: "token/setToken", payload: token });
            dispatch({ type: "user/addInfo", payload: res.data.userInfo });

            f7router.refreshPage();
          })
          .catch(function (e) {
            f7.dialog.alert("Invalid code");
            confirmPhone();
          });
      }
    );
  };

  const signIn = () => {
    f7.dialog.confirm(`Username: ${username}<br>Phone: ${phone}`, (yes) => {
      if (yes) {
        f7.request
          .post(`${API_URL}/auth`, { username, phone })
          .then(function (res) {
            let user = JSON.parse(res.data);

            if (user.exist) {
              dispatch({ type: "user/addInfo", payload: user.userInfo });

              dispatch({
                type: "serverDeliveryOrders/add",
                payload: user.deliveryOrders,
              });

              dispatch({
                type: "serverMoveOrders/add",
                payload: user.moveOrders,
              });

              dispatch({ type: "token/setToken", payload: user.token });
              f7router.refreshPage();
            } else confirmPhone();
          })
          .catch(function (e) {
            f7.dialog.alert("Invalid phone or username");
          });
      }
    });
  };

  return (
    <Page noToolbar noNavbar noSwipeback loginScreen>
      <LoginScreenTitle>Movers</LoginScreenTitle>
      <List form>
        <ListInput
          label="Username"
          type="text"
          placeholder="John Doe"
          value={username}
          onInput={(e) => {
            setUsername(e.target.value);
          }}
          // onFocus={(e) => {
          //   e.target.value = "geo";
          //   setUsername(e.target.value);
          // }}
        />
        <ListInput
          label="Phone"
          type="text"
          placeholder="0701964032"
          value={phone}
          onInput={(e) => {
            setPhone(e.target.value);
          }}
        />
      </List>
      <List>
        <ListButton onClick={signIn}>Sign In</ListButton>
        <BlockFooter>&copy; 2021 movers</BlockFooter>
      </List>
    </Page>
  );
};
