import { useState, useRef, MutableRefObject, useEffect, RefObject } from "react";

type cb = (data: any) => void;

export function usePeerConnection(
  mediaStream: MediaStream | undefined,
  wsRef: RefObject<WebSocket>,
  trackType: string,
  channel: string,
  initiate: boolean,
): [RefObject<RTCPeerConnection>] {
  const pcRef = useRef(null) as MutableRefObject<RTCPeerConnection | null>;

  useEffect(() => {
    if (!mediaStream || !wsRef || !wsRef.current) {
      return;
    }
    const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    const pc = new RTCPeerConnection(configuration);
    console.log(pc);
    pc.addEventListener("icecandidate", (e: RTCPeerConnectionIceEvent) => {
      console.log("icecandidate", e.candidate);
      if (!wsRef || !wsRef.current || !e.candidate) {
        return;
      }
      wsRef.current.send(JSON.stringify({ type: "new_candidate", candidate: e.candidate, channel }));
    });
    pc.addEventListener("negotiationneeded", async () => {
      if (!wsRef || !wsRef.current) {
        return;
      }
      console.log("sending-offer");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      wsRef.current.send(JSON.stringify({ type: "offer", sdp: offer, channel }));
    });
    /*
    pc.addEventListener("track", (e: RTCTrackEvent) => {
      console.log("track-received", e.track);
      if (e.track.kind !== trackType) {
        return;
      }
      mediaStream.addTrack(e.track);
    });
    */

    if (initiate) {
      mediaStream.getTracks().forEach((track) => {
        console.log("sending-track", track);
        if (track.kind !== trackType) {
          return;
        }
        pc.addTrack(track, mediaStream);
      });
    }

    pcRef.current = pc;
    const current = pcRef.current;
    console.log("peer connection setup");
    return () => {
      console.log("peer connection closing");
      if (current) {
        current.close();
      }
    };
  }, [mediaStream, wsRef, trackType, channel]);

  useEffect(() => {
    if (!wsRef || !wsRef.current || !pcRef || !pcRef.current) {
      return;
    }

    const onMessage = async (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      console.log("signal", data);
      if (!mediaStream || !data || !data.type || !wsRef || !wsRef.current || !pcRef || !pcRef.current) {
        return;
      }

      if (data.type === "offer") {
        await pcRef.current.setRemoteDescription(data.sdp);

        for (const track of mediaStream.getTracks()) {
          console.log("received-offer-track", track);
          if (track.kind !== trackType) {
            continue;
          }
          pcRef.current.addTrack(track, mediaStream);
        }

        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        wsRef.current.send(JSON.stringify({ type: "answer", sdp: answer, channel }));
        return;
      }

      if (data.type === "answer") {
        pcRef.current.setRemoteDescription(data.sdp);
        return;
      }

      if (data.type === "new_candidate") {
        pcRef.current.addIceCandidate(data.candidate);
      }
    };
    wsRef.current.addEventListener("message", onMessage);
    return function () {
      if (!wsRef || !wsRef.current) {
        return;
      }
      wsRef.current.removeEventListener("message", onMessage);
    };
  }, [mediaStream, wsRef, pcRef, channel]);

  return [pcRef];
}
