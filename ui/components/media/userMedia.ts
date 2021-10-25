import { useState, useEffect } from "react";

export function useUserMedia(requestedMedia: MediaStreamConstraints) {
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
        //const stream = await navigator.mediaDevices.getDisplayMedia(requestedMedia);
        setMediaStream(stream);
      } catch (err) {
        console.log(err);
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
