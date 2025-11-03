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
  return {
    mediaStream,
    error,
    requestStream,
  };
}
