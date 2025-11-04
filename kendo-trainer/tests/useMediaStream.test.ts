import { it, expect, describe, beforeEach, vi } from "vitest";
import { useMediaStream } from "../src/composables/useMediaStream";

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
const track = { stop: vi.fn() };
const fakeMediaStreamTracks = () => {
  return {
    getUserMedia: vi.fn().mockResolvedValue({
      id: "fake-stream",
      active: true,
      getTracks: () => [track],
    }),
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

  it("stops the stream", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      value: fakeMediaStreamTracks(),
      writable: true,
    });

    const { mediaStream, requestStream, stopStream } = useMediaStream({
      video: true,
    });
    await requestStream();

    expect(mediaStream.value).not.toBeNull();
    const [track] = mediaStream.value!.getTracks();
    const stopSpy = vi.spyOn(track, "stop");

    stopStream();

    expect(stopSpy).toHaveBeenCalled();
    expect(mediaStream.value).toBeNull();
  });
});
