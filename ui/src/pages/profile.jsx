import React from "react";
import {
  Page,
  Navbar,
  List,
  ListInput,
  ListItem,
  Card,
  Icon,
  f7,
} from "framework7-react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectAPI_URL, selectMoveOrders } from "../js/store_redux";

// let user = JSON.parse(localStorage.getItem("user"));
function name(params) {
  if (user.username === null) {
    return "Username";
  } else return user.username;
}

function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const order = useSelector(selectMoveOrders);

  const API_URL = useSelector(selectAPI_URL);

  // const put = () => {
  //   f7.request({
  //     method: "PUT",
  //     url: `${API_URL}/orders/${order[3].id}`,
  //   }).then((res) => {
  //     // console.log(res.data);
  //     // dispatch({ type: "updateStatus", payload: res.data.order });
  //     // f7.dialog.alert("Your order has been approved");
  //   });
  //   console.log("put");
  // };
  return (
    <Page name="profile">
      <Navbar title="Profile" />
      {user ? (
        <Card>
          <List mediaList noHairlinesBetween>
            <ListItem
              link="#"
              // title={name()}
              // title=''
              title={user.username}
              subtitle={user.phone}
              // subtitle=''
            >
              <img
                slot="media"
                src="https://cdn.framework7.io/placeholder/fashion-88x88-2.jpg"
                width="44"
                style={{ borderRadius: "50%" }}
              />
            </ListItem>
          </List>
        </Card>
      ) : (
        <Card>
          <List mediaList noHairlinesBetween>
            <ListItem
              link="#"
              title="Username"
              // title=''
              subtitle="phone number"
              // subtitle=''
            >
              <img
                slot="media"
                src="https://cdn.framework7.io/placeholder/fashion-88x88-2.jpg"
                width="44"
                style={{ borderRadius: "50%" }}
              />
            </ListItem>
          </List>
        </Card>
      )}
    </Page>
  );
}

export default ProfilePage;
