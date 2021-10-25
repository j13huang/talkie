import { useRef, RefObject, MutableRefObject } from "react";
import { useUserMedia } from "./userMedia";
import { PeerAudio } from "./PeerAudio";

interface Props {
  clientID: string;
  wsRef: RefObject<WebSocket>;
  initiate: boolean;
}

const CAPTURE_OPTIONS = {
  audio: true,
};

export const Audio = ({ clientID, wsRef, initiate }: Props) => {
  const [mediaStream] = useUserMedia(CAPTURE_OPTIONS);

  if (!mediaStream) {
    return null;
  }
  return <PeerAudio clientID={clientID} wsRef={wsRef} mediaStream={mediaStream} initiate={initiate} />;
};
