import { useState, useRef, MutableRefObject, useEffect, RefObject } from "react";

type cb = (data: any) => void;

export function useWS(onMessage: cb): [RefObject<WebSocket>, string] {
  const [clientID, setClientID] = useState("");
  const wsRef = useRef(null) as MutableRefObject<WebSocket | null>;

  useEffect(() => {
    const setupWS = () => {
      const ws = new WebSocket("ws://192.168.0.100:3001/ws");
      ws.addEventListener("open", () => console.log("ws opened"));
      ws.addEventListener("message", (e) => {
        const message = JSON.parse(e.data);
        console.log("e", message);
        if (message.clientID) {
          setClientID(message.clientID);
        }
        onMessage(message);
      });
      ws.addEventListener("close", (ev: CloseEvent) => {
        console.log("ws closed", ev);
        if (ev.code === 1000) {
          return;
        }
        const intervalHandle = setInterval(() => {
          console.log("try reconnect");
          try {
            setupWS();
          } catch (e) {
            return;
          }
          clearInterval(intervalHandle);
        }, 1000);
      });

      ws.addEventListener("error", (e: Event) => {
        console.log("ws error", e);
        //ws.close();
      });

      wsRef.current = ws;
    };
    setupWS();

    const wsCurrent = wsRef.current;
    console.log("ws setup");
    return () => {
      console.log("closing");
      if (wsCurrent) {
        wsCurrent.close(1000);
      }
      //wsRef.current = null;
    };
  }, []);

  return [wsRef, clientID];
}
