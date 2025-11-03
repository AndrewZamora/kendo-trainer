import { it, expect, describe, beforeEach, vi } from "vitest";
import { ref } from "vue";

function useMediaStream(constraints: MediaStreamConstraints) {
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

const fakeMediaDeviceSuccess = () => {
  return {
    getUserMedia: vi.fn().mockResolvedValue({
      id: "fake-stream",
      active: true,
      getTracks: () => [],
    }),
  };
};

const fakeMediaDeviceFailure = () => {
  return {
    getUserMedia: vi.fn().mockRejectedValue(new Error("Permission Denied")),
  };
};

describe("useMediaStream", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("request and exposes a media stream when permission is granted", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      value: fakeMediaDeviceSuccess(),
      writable: true,
    });
    const constraints = {
      video: { height: 1280, width: 720 },
    };
    const { mediaStream, error, requestStream } = useMediaStream(constraints);
    expect(mediaStream.value).toBeNull();
    await requestStream();
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith(
      constraints,
    );
    expect(mediaStream.value).toMatchObject({
      id: "fake-stream",
      active: true,
    });
    expect(error.value).toBeNull();
  });

  it("exposes error when permission is not granted", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      value: fakeMediaDeviceFailure(),
      writable: true,
    });
    const { mediaStream, error, requestStream } = useMediaStream({
      video: true,
    });
    await requestStream();
    expect(mediaStream.value).toBeNull();
    expect(error.value).toEqual(new Error("Permission Denied"));
  });
});
