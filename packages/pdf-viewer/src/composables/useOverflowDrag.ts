import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { Ref } from "vue";

export function useOverflowDrag(
  container: Ref<HTMLElement | undefined>,
  options?: { textLayerAware?: Ref<boolean> },
) {
  const mouseDown = ref(false);
  const isOverflowing = ref(false);

  const cursorClass = computed(() => {
    if (!isOverflowing.value) return "";
    return mouseDown.value ? "cursor-grabbing" : "cursor-grab";
  });

  const checkOverflow = () => {
    if (container.value) {
      isOverflowing.value =
        container.value.scrollHeight > container.value.clientHeight ||
        container.value.scrollWidth > container.value.clientWidth;
    }
  };

  const setupDrag = () => {
    const slider = container.value;
    if (!slider) return;

    let startX = 0,
      scrollLeft = 0,
      startY = 0,
      scrollTop = 0;

    const startDragging = (e: MouseEvent) => {
      if (
        options?.textLayerAware?.value &&
        (e.target as Element).closest?.(".textLayer")
      ) {
        return;
      }
      mouseDown.value = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      startY = e.pageY - slider.offsetTop;
      scrollTop = slider.scrollTop;
    };

    const stopDragging = (_e: MouseEvent) => {
      mouseDown.value = false;
    };

    const move = (e: MouseEvent) => {
      if (!mouseDown.value) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const scroll = x - startX;
      const y = e.pageY - slider.offsetTop;
      const scrollY = y - startY;
      slider.scrollLeft = scrollLeft - scroll;
      slider.scrollTop = scrollTop - scrollY;
    };

    slider.addEventListener("mousemove", move, false);
    slider.addEventListener("mousedown", startDragging, false);
    slider.addEventListener("mouseup", stopDragging, false);
    slider.addEventListener("mouseleave", stopDragging, false);
  };

  let resizeObserver: ResizeObserver | null = null;

  onMounted(() => {
    setupDrag();
    resizeObserver = new ResizeObserver(checkOverflow);
    if (container.value) {
      resizeObserver.observe(container.value);
    }
  });

  onBeforeUnmount(() => {
    if (resizeObserver && container.value) {
      resizeObserver.unobserve(container.value);
    }
  });

  return { cursorClass };
}
