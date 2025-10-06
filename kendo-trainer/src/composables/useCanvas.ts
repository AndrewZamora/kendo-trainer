import { ref, onBeforeUnmount, onMounted } from "vue";

export function useCanvas(options: { width: number; height: number }) {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const context = ref<CanvasRenderingContext2D | null>(null);
  let animationId = ref<number | null>(null);

  const start = (renderFunction: () => void) => {
    const loop = () => {
      renderFunction();
      animationId.value = requestAnimationFrame(loop);
    };
    loop();
  };

  const stop = () => {
    if (animationId.value) {
      cancelAnimationFrame(animationId.value);
      animationId.value = null;
    }
  };

  const clear = () => {};

  const exportFrame = () => {};

  onMounted(() => {
    if (canvasRef.value) {
      context.value = canvasRef.value.getContext(
        "2d",
      ) as CanvasRenderingContext2D;
      canvasRef.value.width = options.width;
      canvasRef.value.height = options.height;
    }
  });

  onBeforeUnmount(() => {
    stop();
  });

  return {
    canvasRef,
    context,
    start,
    stop,
    clear,
    exportFrame,
  };
}
