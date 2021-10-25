import { useState, useEffect } from "react";

export function useUserMedia(requestedMedia: MediaStreamConstraints) {
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
        setMediaStream(stream);
      } catch (err) {
        console.log(err);
        // Removed for brevity
      }
    }

    if (!mediaStream) {
      enableStream();
      return;
    }

    return function cleanup() {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [mediaStream, requestedMedia]);

  return [mediaStream];
}
