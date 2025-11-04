import { ref } from "vue";

export function useMediaStream(constraints: MediaStreamConstraints) {
  const mediaStream = ref<MediaStream | null>(null);
  const error = ref<Error | null>(null);

  const requestStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStream.value = stream;
      return stream;
    } catch (err) {
      error.value = err as Error;
    }
  };

  const stopStream = () => {
    if (mediaStream.value) {
      mediaStream.value.getTracks().forEach((track) => track.stop());
      mediaStream.value = null;
    }
  };

  return {
    mediaStream,
    error,
    requestStream,
    stopStream,
  };
}
