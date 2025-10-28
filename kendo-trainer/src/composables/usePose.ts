import { ref, shallowRef } from "vue";
import * as poseDetection from "@tensorflow-models/pose-detection";

export function usePose() {
  const model = poseDetection.SupportedModels.BlazePose;
  const detectorConfig = {
    runtime: "mediapipe",
    modelType: "full",
    solutionPath: "node_modules/@mediapipe/pose",
  };
  const pose = {
    right_elbow: { x: "0", y: "0", z: "0", score: "", name: "right_elbow" },
    right_wrist: { x: "0", y: "0", z: "0", score: "", name: "right_wrist" },
    right_shoulder: {
      x: "0",
      y: "0",
      z: "0",
      score: "",
      name: "right_shoulder",
    },
  };
  let detector = shallowRef<poseDetection.PoseDetector | null>(null);
  let poses = ref<null | poseDetection.Pose[]>(null);
  let currentPose = ref<Record<string, poseDetection.Keypoint>>({});
  let skeleton = ref<null | poseDetection.Keypoint[][]>(null);

  const start = async (video: HTMLVideoElement) => {
    const _detector = await poseDetection.createDetector(model, detectorConfig);
    const _poses = await _detector.estimatePoses(video);
    detector.value = _detector;
    poses.value = _poses;
    for (const pose of _poses) {
      buildSkeleton(pose);
    }
  };
  async function detect(video: HTMLVideoElement) {
    if (detector.value) {
      const _poses = await detector.value.estimatePoses(video);
      poses.value = _poses;
      for (const pose of _poses) {
        skeleton.value = buildSkeleton(pose);
      }
    }
  }
  const dispose = () => {
    if (detector.value) {
      detector.value.dispose();
      detector.value = null;
    }
  };
  const buildCurrentPose = (pose: poseDetection.Pose.keypoints) => {
    const keypoints = pose;
    for (const keypoint of keypoints) {
      if (keypoint.name && currentPose.value[keypoint.name] === keypoint.name) {
        currentPose.value[keypoints.name] = keypoint;
      }
    }
  };
  const buildSkeleton = (
    pose: poseDetection.Pose,
  ): poseDetection.Keypoint[][] => {
    return poseDetection.util
      .getAdjacentPairs(poseDetection.SupportedModels.BlazePose)
      .map((pair) => {
        const [a, b] = pair;
        const bodyPointA = pose.keypoints[a];
        const bodyPointB = pose.keypoints[b];
        return [bodyPointA, bodyPointB];
      });
  };

  return {
    start,
    detect,
    dispose,
    skeleton,
    detector,
    poses,
  };
}
