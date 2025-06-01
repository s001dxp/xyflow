import { ref, onMounted, onUnmounted } from 'vue';
import { useKeyPress as useSystemKeyPress } from '@xyflow/system';

export function useKeyPress(keyCode: string | Array<string>) {
  const pressed = ref(false);
  let cleanup: (() => void) | undefined;

  onMounted(() => {
    cleanup = useSystemKeyPress({
      keyCode,
      onKeyDown: () => pressed.value = true,
      onKeyUp: () => pressed.value = false,
    });
  });

  onUnmounted(() => {
    if (cleanup) {
      cleanup();
    }
  });

  return pressed;
}
