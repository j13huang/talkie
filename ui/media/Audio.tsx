import { useRef, MutableRefObject, useEffect } from "react";
import { useUserMedia } from "./userMedia";

interface Props {}

const CAPTURE_OPTIONS = {
  audio: true,
};

export function Audio(props: Props) {
  const audioRef = useRef() as MutableRefObject<HTMLAudioElement>;
  const mediaStream = useUserMedia(CAPTURE_OPTIONS);

  useEffect(() => {
    const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    const pc = new RTCPeerConnection(configuration);
  }, []);

  if (mediaStream && audioRef.current && !audioRef.current.srcObject) {
    audioRef.current.srcObject = mediaStream;
  }

  function handleCanPlay() {
    audioRef.current.play();
  }

  if (!audioRef.current) {
    return null;
  }
  //return <audio ref={audioRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />;
  return null;
}
