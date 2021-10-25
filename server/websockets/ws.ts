import * as http from "http";
import { WebSocket, Server as WebSocketServer, RawData } from "ws";
import { EVENT_TYPES } from "../../shared/websockets";

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
  count: number;

  constructor(server: http.Server) {
    this.clients = {};
    this.count = 0;
    this.wss = new WebSocketServer({ server: server, path: "/ws" });

    this.wss.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
      const clientID = getUniqueID();
      this.clients[clientID] = ws;

      console.log("One client connected", req.socket.remoteAddress, Object.keys(this.clients));
      ws.on("message", this.onMessage);

      ws.on("close", (code: number, reason: Buffer) => {
        console.log("ws close");
        delete this.clients[clientID];
        ws.close();
      });

      ws.on("error", (err: Error) => {
        console.log("ws error", err);
        ws.close();
      });

      ws.send(JSON.stringify({ clientID: clientID, count: this.count }));
    });
  }

  onMessage = (msg: RawData) => {
    console.log(`incoming msg is = ${msg}`);
    const data = JSON.parse(msg.toString());
    console.log(data.type, EVENT_TYPES.INCREMENT_COUNT);
    switch (data.type) {
      case EVENT_TYPES.INCREMENT_COUNT:
        this.count = this.count + 1;
        this.broadcast({ count: this.count });
        return;
    }
  };

  broadcast(msg: { [key: string]: any }) {
    this.wss.clients.forEach((client) => {
      // Check that connect are open and still alive to avoid socket error
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  }
}
