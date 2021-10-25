import { useRef, MutableRefObject } from "react";
import { useUserMedia } from "./userMedia";

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: "user" },
};

export function Video() {
  const videoRef = useRef() as MutableRefObject<HTMLVideoElement>;
  const [mediaStream] = useUserMedia(CAPTURE_OPTIONS);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  function handleCanPlay() {
    videoRef.current.play();
  }

  //return <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />;
  return null;
}
