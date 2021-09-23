   let conn = socket.connect(f7, token);
      // const objectsEqual = (o1, o2) =>
      //   typeof o1 === "object" && Object.keys(o1).length > 0
      //     ? Object.keys(o1).length === Object.keys(o2).length &&
      //       Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
      //     : o1 === o2;

      // const arraysEqual = (a1, a2) =>
      //   a1.length === a2.length &&
      //   a1.every((o, idx) => objectsEqual(o, a2[idx]));

      // return conn.emit("checkDoc", []);

      // if (localStorage.getItem("doc")) {
      //   const uiDoc = JSON.parse(localStorage.getItem("doc"));
      //   console.log(uiDoc);
      //   conn.emit("checkDoc", uiDoc);
      //   console.log("emit checkDoc found");
      // } else {
      //   conn.emit("checkDoc", []);

      //   console.log("emit checkDoc, empty");
      // }

      conn.on("notifications", (doc) => {
        // console.log(moveOrders);
        console.log("update", doc);
        // let doc2 = doc.map((e) => e);
        // console.log(doc2);

        // if ((doc.length = 1)) {
        //   localStorage.setItem("doc", JSON.stringify(doc));
        //   moveOrders.filter((order) =>
        //     doc.some((update) => {
        //       if (order.id === update.order) {
        //         console.log(order, update);
        //         console.log("starting dispatch");

        //         // dispatch({
        //         //   type: "updateStatus",
        //         //   payload: {
        //         //     id: update.order,
        //         //     status: update.status,
        //         //   },
        //         // });
        //         console.log("dispatched");
        //         conn.emit("checkDb", doc);
        //       }
        //     })
        //   );
        // } else if (
        //   doc.length == JSON.parse(localStorage.getItem("doc")).length
        // ) {
        //   moveOrders.filter((order) =>
        //     doc.some((update) => {
        //       if (order.id === update.order) {
        //         console.log(order, update);
        //         console.log("starting dispatch");

        //         // dispatch({
        //         //   type: "updateStatus",
        //         //   payload: {
        //         //     id: update.order,
        //         //     status: update.status,
        //         //   },
        //         // });
        //         console.log("dispatched");
        //         // conn.emit("checkDb", doc);
        //       }
        //     })
        //   );
        // }

        return setTimeout(() => {
          conn.emit("db", { items: ["cats", "dogs", "min"] });
          console.log("timeOut");
        }, 500);

        if (socketCount === 0 && doc) {
          // return console.log(socketCount);
          localStorage.setItem("doc", JSON.stringify(doc));
          moveOrders.filter((order) =>
            doc.some((update) => {
              if (order.id === update.order) {
                console.log(order, update);
                console.log("starting dispatch");

                dispatch({
                  type: "updateStatus",
                  payload: {
                    id: update.order,
                    status: update.status,
                  },
                });
                console.log("dispatched");
                //  conn.emit("checkDb", doc);
              }
            })
          );
        } else if (
          socketCount >= 1 &&
          doc.length > JSON.parse(localStorage.getItem("doc")).length
        ) {
          console.log("am > 1", socketCount);

          localStorage.setItem("doc", JSON.stringify(doc));

          moveOrders.filter((order) =>
            doc.some((update) => {
              if (order.id === update.order) {
                console.log(order, update);
                console.log("starting dispatch");

                dispatch({
                  type: "updateStatus",
                  payload: {
                    id: update.order,
                    status: update.status,
                  },
                });
                console.log("dispatched");
                // conn.emit("checkDb", doc);
              }
            })
          );
        } else {
          console.log("Everything is upto date");
          conn.emit("updateSuccessful", doc);
        }

        // let intersection =
        // if (socketCount >= 0 && pendingNotification.get("doc") !== doc) {
        //   let pendingNotification = new Map();
        //   pendingNotification.set("doc", doc);
        //   // return console.log(pendingNotification.get("doc"), "pending");
        //   if (doc) {
        //     moveOrders.filter((order) =>
        //       doc.some((update) => {
        //         if (order.id === update.order) {
        //           console.log(order, update);
        //           console.log("starting dispatch");

        //           // dispatch({
        //           //   type: "updateStatus",
        //           //   payload: {
        //           //     id: update.order,
        //           //     status: update.status,
        //           //   },
        //           // });
        //           console.log("dispatched");
        //           conn.emit("checkDb", doc);
        //         }
        //       })
        //     );
        //   }
        // }

        // console.log("intersection", intersection);