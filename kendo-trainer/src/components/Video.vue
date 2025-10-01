<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useVideo } from "../composables/useVideo";
import { useCanvas } from "../composables/useCanvas";
import { usePose } from "../composables/usePose";

interface Props {
  width: number;
  height: number;
  hidden?: boolean;
}

const props = defineProps<Props>();
const { detector, detect, poses, start: startPose, drawSkeleton } = usePose();
const { videoRef, startStream } = useVideo();
const {
  canvasRef,
  context,
  start: startCanvas,
} = useCanvas({
  width: props.width,
  height: props.height,
});

const drawVideo = (
  context: CanvasRenderingContext2D,
  videoRef: HTMLVideoElement
) => {
  context.drawImage(videoRef, 0, 0);
};

const drawShapes = (context: CanvasRenderingContext2D) => {

};

const draw = () => {
  if (!context.value || !videoRef.value) return;
  drawVideo(context.value, videoRef.value);
  if (detector.value) {
    detect(videoRef.value);
  }
  drawShapes(context.value);
};

onMounted(async () => {
  await startStream();
  startCanvas(draw);
  if (videoRef.value) {
    startPose(videoRef.value);
  }
});
</script>

<template>
  <video
    ref="videoRef"
    :width="width"
    :height="height"
    :hidden="hidden"
  ></video>
  <canvas ref="canvasRef" :width="width" :height="height"></canvas>
  <div v-if="poses">
    {{ poses }}
  </div>
</template>
