import { io } from "socket.io-client";

export default {
  connect(f7, token, serverUrl = "http://localhost:3000") {
    this.f7 = f7;
    const socket = (f7.socket = io(serverUrl, {
      auth: {
        token: token,
      },
    }));
    // socket.reconnect()
    return socket;
    // socket.on("notifications", (doc) => {
    //   console.log(doc);

    // });
    //f7.socket = socket

    // socket.on("connect", function () {
    //   f7.socket.emit("token", token);
    //   console.log(token);
    // });
  },

  disconnect() {
    this.client.end();
  },
};
