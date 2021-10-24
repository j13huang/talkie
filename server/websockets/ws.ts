import * as http from "http";
import WebSocket, { WebSocketServer } from "ws";

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

export class Server {
  wss: WebSocketServer;
  clients: {};

  constructor(server: http.Server) {
    this.clients = {};
    this.wss = new WebSocketServer({ server: server, path: "/ws" });

    this.wss.on("connection", (ws) => {
      console.log("One client connected");
      ws.on("message", (msg) => {
        ws.send(`incoming msg is = ${msg}`);
      });
    });

    this.wss.on("request", function (request) {
      var userID = getUniqueID();
      console.log(new Date() + " Recieved a new connection from origin " + request.origin + ".");
      // You can rewrite this part of the code to accept only the requests from allowed origin
      const connection = request.accept(null, request.origin);
      this.clients[userID] = connection;
      console.log("connected: " + userID + " in " + Object.keys(this.clients));
    });
  }

  broadcast(msg: string) {
    this.wss.clients.forEach((client) => {
      // Check that connect are open and still alive to avoid socket error
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  }
}
