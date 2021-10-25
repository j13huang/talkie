import { useState, useRef, MutableRefObject, useEffect, RefObject } from "react";
import * as Peer from "simple-peer";

type cb = (data: any) => void;

export function usePeerConnection(
  mediaStream: MediaStream,
  streamRef: RefObject<HTMLMediaElement>,
  wsRef: RefObject<WebSocket>,
  onMessage: cb,
) {
  const [peers, setPeers] = useState<Peer.Instance[]>([]);

  useEffect(() => {
    if (!mediaStream) {
      return;
    }
    const peer: Peer.Instance = new (window as any).SimplePeer({
      initiator: true,
      config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
      stream: mediaStream,
    });
    peer.on("signal", (data) => {
      console.log(data);
    });

    peer.on("stream", (stream) => {
      if (streamRef.current) {
        streamRef.current.srcObject = stream;
      }
    });
    onMessage({});

    return () => {
      console.log("closing");
    };
  }, [mediaStream, streamRef]);

  return;
}
