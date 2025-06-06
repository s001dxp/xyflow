import { ref, onMounted, onUnmounted } from 'vue';

export function useKeyPress(keyCode: string | Array<string>) {
  const pressed = ref(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (Array.isArray(keyCode)) {
      if (keyCode.includes(event.key)) {
        pressed.value = true;
      }
    } else if (event.key === keyCode) {
      pressed.value = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (Array.isArray(keyCode)) {
      if (keyCode.includes(event.key)) {
        pressed.value = false;
      }
    } else if (event.key === keyCode) {
      pressed.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  });

  return pressed;
}
