import { useState, useRef, MutableRefObject, useEffect } from "react";

type cb = (data: any) => void;

export function useWS(onMessage: cb) {
  const wsRef = useRef() as MutableRefObject<WebSocket>;

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001/ws");
    ws.addEventListener("open", () => console.log("ws opened"));
    ws.addEventListener("message", (e) => {
      const message = JSON.parse(e.data);
      console.log("e", message);
      onMessage(message);
    });
    ws.addEventListener("close", () => console.log("ws closed"));

    wsRef.current = ws;
    const wsCurrent = wsRef.current;
    console.log("ws setup");
    return () => {
      console.log("closing");
      wsCurrent.close();
    };
  }, []);

  return wsRef;
}
