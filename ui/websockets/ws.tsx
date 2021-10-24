import { useState, useRef, MutableRefObject, useEffect } from "react";

export function useWS() {
  const wsRef = useRef() as MutableRefObject<WebSocket>;

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001/ws");
    ws.addEventListener("open", () => console.log("ws opened"));
    ws.addEventListener("message", (e) => {
      const message = JSON.parse(e.data);
      console.log("e", message);
    });
    ws.addEventListener("close", () => console.log("ws closed"));

    wsRef.current = ws;
    const wsCurrent = wsRef.current;
    return () => {
      wsCurrent.close();
    };
  }, []);

  return wsRef.current;
}
