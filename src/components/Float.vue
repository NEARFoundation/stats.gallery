<template>
  <slot :left="left" :top="top" :width="width" :height="height" />
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  ref,
  toRefs,
  VNode,
  watch,
} from 'vue';

export default defineComponent({
  props: {
    anchorRef: {
      type: Object as PropType<VNode | HTMLElement | null>,
      required: true,
    },
    targetRef: {
      type: Object as PropType<VNode | HTMLElement | null>,
      required: true,
    },
    watchRef: {
      type: Object as PropType<unknown>,
      required: true,
    },
    snap: {
      type: String as PropType<'left' | 'center' | 'right'>,
      default: 'center',
    },
    xGap: {
      type: Number as PropType<number>,
      default: 5,
    },
  },
  setup(props) {
    const isVNode = (x: unknown): x is VNode => 'el' in (x as VNode);

    const getHTMLElement = (x: VNode | HTMLElement): HTMLElement =>
      isVNode(x) ? (x.el as HTMLElement) : x;

    const left = ref(0);
    const top = ref(0);
    const width = ref(0);
    const height = ref(0);

    onMounted(() => {
      const reposition = () => {
        if (props.anchorRef && props.targetRef) {
          const anchor = getHTMLElement(props.anchorRef);
          const target = getHTMLElement(props.targetRef);
          const anchorRect = anchor.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          top.value = anchorRect.top + anchorRect.height;

          left.value = Math.max(
            0 + props.xGap,
            Math.min(
              props.snap === 'left'
                ? anchorRect.left // left edges match
                : props.snap === 'center'
                ? anchorRect.left + anchorRect.width / 2 - targetRect.width / 2 // centers match
                : anchorRect.left + anchorRect.width - targetRect.width, // right edges match
              document.documentElement.clientWidth -
                targetRect.width -
                props.xGap,
            ),
          );

          width.value = anchorRect.width;
          height.value = anchorRect.height;
        }
      };

      reposition();

      window.addEventListener('resize', reposition);
      window.addEventListener('scroll', reposition);

      watch(toRefs(props).watchRef, reposition);
    });

    return {
      left,
      top,
      width,
      height,
    };
  },
});
</script>
