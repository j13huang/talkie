import { useRef, RefObject, MutableRefObject, useEffect } from "react";
import { usePeerConnection } from "../../lib/peerConnection";

interface Props {
  wsRef: RefObject<WebSocket>;
  mediaStream: MediaStream;
}

const TRACK_TYPE = "video";

export const PeerScreenShare = ({ wsRef, mediaStream }: Props) => {
  const videoRef = useRef() as MutableRefObject<HTMLVideoElement>;
  const [pcRef] = usePeerConnection(mediaStream, wsRef, TRACK_TYPE, "channel", "");

  useEffect(() => {
    if (!mediaStream || !pcRef || !pcRef.current) {
      return;
    }

    const onTrack = (e: RTCTrackEvent) => {
      console.log("track-received", e.track);
      if (e.track.kind !== TRACK_TYPE) {
        return;
      }
      if (videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = e.streams[0];
      }
    };
    pcRef.current.addEventListener("track", onTrack);
    return () => {
      if (!pcRef || !pcRef.current) {
        return;
      }
      pcRef.current.removeEventListener("track", onTrack);
    };
  }, [pcRef, videoRef]);

  function handleCanPlay() {
    videoRef.current.play();
  }

  return <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline />;
};
