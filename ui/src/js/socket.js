import { io } from "socket.io-client";

export default {
  connect(f7, token, serverUrl = "http://localhost:5000") {
    this.f7 = f7;
    const socket = (f7.socket = io(serverUrl, {
      reconnectionAttempts: 10,
      reconnectionDelay: 5000,
      reconnectionDelayMax: 5000,
      auth: {
        token: token,
      },
    }));

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
