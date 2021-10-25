import * as express from "express";
import * as cors from "cors";
import { createServer } from "http";
import * as websockets from "./websockets";

const app = express();
const httpServer = createServer(app);
const wss = new websockets.Server(httpServer);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("*", (req, res) => {
  res.sendFile("../ui/index.html", { root: __dirname });
});

app.post("/request", (req, res) => {
  res.status(200).send({ message: "video is added to playlist" });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Express listening on ${PORT}`);
});
