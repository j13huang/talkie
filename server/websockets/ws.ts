import * as http from "http";
import { WebSocket, Server as WebSocketServer } from "ws";

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
  clients: { [key: string]: any };

  constructor(server: http.Server) {
    this.clients = {};
    this.wss = new WebSocketServer({ server: server, path: "/ws" });

    this.wss.on("connection", (ws: WebSocket) => {
      console.log("One client connected");
      var userID = getUniqueID();
      this.clients[userID] = ws;

      ws.on("message", (msg) => {
        ws.send(`incoming msg is = ${msg}`);
      });
    });
  }

  onMessage = (message: WebSocket, websocket: http.IncomingMessage) => {
    if (!message || !websocket) return;

    try {
      /*
      if (message.checkPresence) {
        //checkPresence(message, websocket);
      } else if (message.open) {
        //onOpen(message, websocket);
      } else {
        //sendMessage(message, websocket);
      }
      */
    } catch (e) {}
  };

  broadcast(msg: string) {
    this.wss.clients.forEach((client) => {
      // Check that connect are open and still alive to avoid socket error
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  }
}
