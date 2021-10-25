import { useRef, RefObject, MutableRefObject, useEffect } from "react";
import { usePeerConnection } from "../../lib/peerConnection";

interface Props {
  clientID: string;
  wsRef: RefObject<WebSocket>;
  mediaStream: MediaStream;
  initiate: boolean;
}

const TRACK_TYPE = "audio";

export const PeerAudio = ({ clientID, wsRef, mediaStream, initiate }: Props) => {
  const audioRef = useRef() as MutableRefObject<HTMLAudioElement>;
  const [pcRef] = usePeerConnection(mediaStream, wsRef, TRACK_TYPE, "channel", initiate);

  useEffect(() => {
    if (!mediaStream || !pcRef || !pcRef.current) {
      return;
    }

    const onTrack = (e: RTCTrackEvent) => {
      console.log("track-received", e.track);
      if (e.track.kind !== TRACK_TYPE) {
        return;
      }
      if (audioRef.current && !audioRef.current.srcObject) {
        audioRef.current.srcObject = e.streams[0];
      }
    };
    pcRef.current.addEventListener("track", onTrack);
    return () => {
      if (!pcRef || !pcRef.current) {
        return;
      }
      pcRef.current.removeEventListener("track", onTrack);
    };
  }, [pcRef, audioRef]);

  function handleCanPlay() {
    audioRef.current.play();
  }

  return <audio ref={audioRef} onCanPlay={handleCanPlay} autoPlay playsInline />;
};
