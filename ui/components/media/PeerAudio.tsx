import { useRef, RefObject, MutableRefObject } from "react";
import { usePeerConnection } from "../../lib/peerConnection";

interface Props {
  wsRef: RefObject<WebSocket>;
  mediaStream: MediaStream;
}

const CAPTURE_OPTIONS = {
  audio: true,
};

export const PeerAudio = ({ wsRef, mediaStream }: Props) => {
  const audioRef = useRef() as MutableRefObject<HTMLAudioElement>;
  usePeerConnection(mediaStream, audioRef, wsRef, () => {});

  if (mediaStream && audioRef.current && !audioRef.current.srcObject) {
    //audioRef.current.srcObject = mediaStream;
  }

  function handleCanPlay() {
    audioRef.current.play();
  }

  if (!audioRef.current) {
    return null;
  }

  return <audio ref={audioRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />;
};
