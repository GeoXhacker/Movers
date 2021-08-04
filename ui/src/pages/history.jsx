import {
  BlockTitle,
  Card,
  CardContent,
  CardFooter,
  Link,
  List,
  ListItem,
  Navbar,
  Page,
} from "framework7-react";
import React from "react";
import { useSelector } from "react-redux";
import { selectDeliveryOrders, selectMoveOrders } from "../js/store_redux";

const HistoryPage = () => {
  let moveOrders = useSelector(selectMoveOrders);
  let deliveryOrders = useSelector(selectDeliveryOrders);
  const orders = moveOrders.concat(deliveryOrders);

  return (
    <Page name="history">
      <Navbar title="History" />
      <List mediaList>
        {orders.length ? (
          orders.map((order, index) => (
            //   <Card title={order.moveType} key={index}>
            //     <CardContent>
            //       <p>{order.moverType}</p>
            //       {order.pickUpAddress.lat} to {order.destinationAddress.lat}
            //       <p>{order.shiftNeed}</p>
            //     </CardContent>
            //     <CardFooter>{order.status}</CardFooter>
            //   </Card>
            // ))

            <ListItem
              link="#"
              title={order.moveType || order.what}
              after={order.status}
              subtitle={`${order.pickUpAddressName} to ${order.destinationAddressName}`}
              text={`${order.shiftNeed}    ${order.scheduleDate}`}
              key={index}
            >
              <Link slot="media">
                {order.moveType ? (
                  <span
                    class="material-icons"
                    style={{ width: 48, height: 48, fontSize: 40 }}
                  >
                    local_shipping
                  </span>
                ) : (
                  <span
                    class="material-icons"
                    style={{ width: 48, height: 48, fontSize: 40 }}
                  >
                    local_post_office
                  </span>
                  // <svg src="/static/delivery_dining_black_24dp.svg"></svg>
                )}
              </Link>
            </ListItem>
          ))
        ) : (
          <BlockTitle>No orders yet</BlockTitle>
        )}
      </List>
    </Page>
  );
};

export default HistoryPage;
