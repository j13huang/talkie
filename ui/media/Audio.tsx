import { useRef, MutableRefObject } from "react";
import { useUserMedia } from "./userMedia";

interface Props {}

const CAPTURE_OPTIONS = {
  audio: true,
  video: false,
};

export function Audio(props: Props) {
  const audioRef = useRef() as MutableRefObject<HTMLAudioElement>;
  const mediaStream = useUserMedia(CAPTURE_OPTIONS);

  if (mediaStream && audioRef.current && !audioRef.current.srcObject) {
    audioRef.current.srcObject = mediaStream;
  }

  function handleCanPlay() {
    audioRef.current.play();
  }

  return <audio ref={audioRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />;
}
