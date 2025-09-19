<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useVideo } from "../composables/useVideo";
import { useCanvas } from "../composables/useCanvas";

interface Props {
    width: number;
    height: number;
    hidden?: boolean;
}

const props = defineProps<Props>();
const { videoRef, startStream, } = useVideo();
const { canvasRef, context, start: startCanvas } = useCanvas({
    width: props.width,
    height: props.height,
});

const draw = () => {
    if (context.value && videoRef.value) {
        context.value.drawImage(videoRef.value, 0, 0);
    }
};

onMounted(async () => {
    await startStream();
    startCanvas(draw);
});

</script>

<template>
    <video ref="videoRef" :width="width" :height="height" :hidden="hidden"></video>
    <canvas ref="canvasRef" :width="width" :height="height"></canvas>
</template>
