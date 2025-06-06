<template>
  <div
    :class="[
      'vue-flow__background',
      { 'vue-flow__background-dots': variant === 'dots' },
      { 'vue-flow__background-lines': variant === 'lines' },
      { 'vue-flow__background-cross': variant === 'cross' }
    ]"
    :style="backgroundStyle"
  />
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';

export type BackgroundVariant = 'dots' | 'lines' | 'cross';

export default defineComponent({
  name: 'Background',
  props: {
    variant: {
      type: String as () => BackgroundVariant,
      default: 'dots',
      validator: (value: string) => ['dots', 'lines', 'cross'].includes(value)
    },
    gap: {
      type: Number,
      default: 20
    },
    size: {
      type: Number,
      default: 1
    },
    color: {
      type: String,
      default: '#81818a'
    },
    patternColor: {
      type: String,
      default: '#81818a'
    },
    style: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const store = inject(VUE_FLOW_SYMBOL);

    const backgroundStyle = computed(() => {
      const { gap, size, color, patternColor, style } = props;
      const zoom = store?.viewport.zoom ?? 1;
      const scaledGap = gap * zoom;
      const scaledSize = size * zoom;

      return {
        '--xy-background-gap': `${scaledGap}px`,
        '--xy-background-size': `${scaledSize}px`,
        '--xy-background-color': color,
        '--xy-background-pattern-color': patternColor,
        ...style
      };
    });

    return {
      backgroundStyle
    };
  }
});
</script>

<style>
.vue-flow__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  user-select: none;
  z-index: -1;
}

.vue-flow__background-dots {
  background-image: radial-gradient(
    circle at center,
    var(--xy-background-pattern-color, #81818a) var(--xy-background-size, 1px),
    transparent var(--xy-background-size, 1px)
  );
  background-size: var(--xy-background-gap, 20px) var(--xy-background-gap, 20px);
  background-color: var(--xy-background-color, transparent);
}

.vue-flow__background-lines {
  background-image: linear-gradient(
      to right,
      var(--xy-background-pattern-color, #81818a) var(--xy-background-size, 1px),
      transparent var(--xy-background-size, 1px)
    ),
    linear-gradient(
      to bottom,
      var(--xy-background-pattern-color, #81818a) var(--xy-background-size, 1px),
      transparent var(--xy-background-size, 1px)
    );
  background-size: var(--xy-background-gap, 20px) var(--xy-background-gap, 20px);
  background-color: var(--xy-background-color, transparent);
}

.vue-flow__background-cross {
  background-image: radial-gradient(
      circle at center,
      var(--xy-background-pattern-color, #81818a) var(--xy-background-size, 1px),
      transparent var(--xy-background-size, 1px)
    ),
    linear-gradient(
      to right,
      var(--xy-background-pattern-color, #81818a) var(--xy-background-size, 1px),
      transparent var(--xy-background-size, 1px)
    ),
    linear-gradient(
      to bottom,
      var(--xy-background-pattern-color, #81818a) var(--xy-background-size, 1px),
      transparent var(--xy-background-size, 1px)
    );
  background-size: var(--xy-background-gap, 20px) var(--xy-background-gap, 20px);
  background-color: var(--xy-background-color, transparent);
}
</style>
