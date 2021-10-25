import * as http from "http";
import { WebSocket, Server as WebSocketServer, RawData } from "ws";
import { EVENT_TYPES } from "../../shared/websockets";

// This code generates unique userid for everyuser.
const getUniqueID = (extra: string) => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4()}${s4()}-${s4()}-${extra}`;
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
      const connectedUsers = Object.keys(this.clients);
      const clientID = getUniqueID(req.socket.remoteAddress);
      this.clients[clientID] = ws;
      const allUsers = [...connectedUsers, clientID];

      ws.on("message", this.onMessage(ws));
      ws.on("close", (code: number, reason: Buffer) => {
        delete this.clients[clientID];
        console.log("ws close", clientID, Object.keys(this.clients));
        this.broadcast({ users: Object.keys(this.clients) }, ws);
        ws.close();
      });
      ws.on("error", (err: Error) => {
        console.log("ws error", err);
        ws.close();
      });

      console.log("One client connected", req.socket.remoteAddress, clientID, allUsers);
      ws.send(JSON.stringify({ clientID, initiateWithUsers: connectedUsers }));
      this.broadcast({ count: this.count, users: allUsers });
    });
  }

  onMessage = (ws: WebSocket) => (msg: RawData) => {
    console.log(`incoming msg is = ${msg}`);
    const data = JSON.parse(msg.toString());
    switch (data.type) {
      case EVENT_TYPES.INCREMENT_COUNT:
        this.count = this.count + 1;
        this.broadcast({ count: this.count });
        return;
      case EVENT_TYPES.OFFER:
        this.clients[data.peerID].send(msg.toString());
        return;
      case EVENT_TYPES.ANSWER:
        this.clients[data.originID].send(msg.toString());
        return;
      case EVENT_TYPES.NEW_CANDIDATE:
        this.clients[data.to].send(msg.toString());
        return;
    }
  };

  broadcast(data: { [key: string]: any }, skip?: WebSocket) {
    this.wss.clients.forEach((client) => {
      // Check that connect are open and still alive to avoid socket error
      if (client.readyState !== WebSocket.OPEN || client === skip) {
        return;
      }
      client.send(JSON.stringify(data));
    });
  }
}
