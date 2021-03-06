import { useRef, RefObject, MutableRefObject } from "react";
import { useUserMedia } from "./userMedia";
import { PeerScreenShare } from "./PeerScreenShare";

interface Props {
  wsRef: RefObject<WebSocket>;
}

// maybe helpful https://blog.logrocket.com/responsive-camera-component-react-hooks/
const CAPTURE_OPTIONS = {
  audio: false,
  video: {
    //cursor: "always",
  },
};

export const ScreenShare = ({ wsRef }: Props) => {
  const [mediaStream] = useUserMedia(CAPTURE_OPTIONS);

  if (!mediaStream) {
    return null;
  }
  return <PeerScreenShare wsRef={wsRef} mediaStream={mediaStream} />;
};
