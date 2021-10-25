import { useRef, RefObject, MutableRefObject } from "react";
import { useUserMedia } from "./userMedia";
import { PeerAudio } from "./PeerAudio";

interface Props {
  // ws client id of this ws
  originID: string;
  wsRef: RefObject<WebSocket>;
  // ws client id of peer ws
  peerID: string;
}

const CAPTURE_OPTIONS = {
  audio: true,
};

export const Audio = ({ originID, wsRef, peerID }: Props) => {
  const [mediaStream] = useUserMedia(CAPTURE_OPTIONS);

  if (!mediaStream) {
    return null;
  }
  return <PeerAudio wsRef={wsRef} mediaStream={mediaStream} originID={originID} peerID={peerID} />;
};
