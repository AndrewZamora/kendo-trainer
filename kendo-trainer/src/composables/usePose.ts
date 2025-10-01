import { ref, onBeforeUnmount, onMounted, nextTick, shallowRef } from "vue";
import type { PoseNet, PoseNetPose } from "../types/poseNet";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as pose from '@mediapipe/pose';

export function usePose() {
    const model = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
        runtime: 'mediapipe',
        modelType: 'full',
        solutionPath: 'node_modules/@mediapipe/pose'
    }

    let detector = shallowRef<any | null>(null);
    let poses = ref<null | any[]>(null);

    const start = async (video: HTMLVideoElement) => {
        const _detector = await poseDetection.createDetector(model, detectorConfig);
        const _poses = await _detector.estimatePoses(video);
        detector.value = _detector;
        poses.value = _poses
        console.log(detector, _poses, poses.value)
        console.log({ _poses })
    }
    async function detect(video: HTMLVideoElement) {
        if (detector.value) {
            const _poses = await detector.value.estimatePoses(video);
            poses.value = _poses;
        }
    }
    const dispose = () => {
        if (detector.value) {
            detector.value.dispose();
            detector.value = null;
        }
    }
    const drawSkeleton = (pose:PoseNetPose['pose']) => {
        poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.BlazePose).forEach((pair) => {

        });
    }


    onMounted(async () => {
        // console.log(_detector)
    });

    return {
        start,
        detect,
        dispose,
        drawSkeleton,
        detector,
        poses,
    }
}