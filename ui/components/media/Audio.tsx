import { useRef, RefObject, MutableRefObject } from "react";
import { useUserMedia } from "./userMedia";
import { PeerAudio } from "./PeerAudio";

interface Props {
  wsRef: RefObject<WebSocket>;
}

const CAPTURE_OPTIONS = {
  audio: true,
};

export const Audio = ({ wsRef }: Props) => {
  const [mediaStream] = useUserMedia(CAPTURE_OPTIONS);

  if (!mediaStream) {
    return null;
  }
  return <PeerAudio wsRef={wsRef} mediaStream={mediaStream} />;
  //return null;
};
