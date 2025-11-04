import { ref, onBeforeUnmount } from "vue";
import { useMediaStream } from "./useMediaStream";

export function useVideo() {
  const videoRef = ref<HTMLVideoElement | null>(null);
  const stream = ref<MediaStream | null>(null);
  const error = ref<Error | null>(null);
  const currentFacingMode = ref<"user" | "environment">("user");
  const constraints = {
    video: { facingMode: currentFacingMode.value },
    audio: false,
  };
  const { requestStream, stopStream } = useMediaStream(constraints);
  const startStream = async (
    facingMode: "user" | "environment" = currentFacingMode.value,
  ): Promise<void> => {
    try {
      stopStream();

      const mediaStream = await requestStream();
      if (mediaStream) {
        stream.value = mediaStream;
        currentFacingMode.value = facingMode;

        if (videoRef.value) {
          videoRef.value.srcObject = mediaStream;
          videoRef.value.play();
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    }
  };

  const toggleCamera = async (): Promise<void> => {
    const nextMode =
      currentFacingMode.value === "user" ? "environment" : "user";
    await startStream(nextMode);
  };

  onBeforeUnmount(() => {
    stopStream();
  });

  return {
    videoRef,
    stream,
    error,
    currentFacingMode,
    startStream,
    stopStream,
    toggleCamera,
  };
}
