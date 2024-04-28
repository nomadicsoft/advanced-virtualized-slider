<script setup lang="ts">
import { type PropType, TransitionGroup, type VNode } from "vue";
import {
  SlideChangeDirection,
  SliderTransition,
  type SliderTransition as SliderTransitionType,
} from "@/enums/slider";

/*
 * composables
 */
const {
  findSliderItemComponents,
  computeSlidesToRender,

  handleSwipeableTouchStart,
  handleSwipeableTouchMove,
  handleSwipeableTouchEnd,

  handleSwipeableMouseDown,
  handleSwipeableMouseMove,
  handleSwipeableMouseEnd,
} = useSliderUtils();

const sliderContainer = ref();

/*
 * props
 */
const props = defineProps({
  arrows: { type: Boolean, default: true },
  transition: {
    type: String as PropType<SliderTransitionType | null>,
    default: SliderTransition.Slide,
  },
  transitionDuration: { type: [String, Number], default: 300 },
  infinite: { type: Boolean, default: false },
  autoplay: { type: Boolean, default: false },
  autoplayDuration: { type: [String, Number], default: 3000 },
  vertical: { type: Boolean, default: false },
  swipeable: { type: Boolean, default: true },
});

/*
 * default slot (SliderItem components)
 */
const slots = useSlots();
let defaultSlot = ref<Array<VNode>>(slots?.default ? slots.default() : []);

watchEffect(() => {
  defaultSlot.value = slots?.default ? slots.default() : [];
});

const sliderItemsComponents = computed<Array<VNode>>(() =>
  findSliderItemComponents(defaultSlot.value),
);

/*
 * current slide (model value)
 */
const model = defineModel<string | number>();

/*
 * slides to render
 * current rendered slide index
 */
const slides = computed<Array<VNode>>(() => {
  return computeSlidesToRender(sliderItemsComponents.value, model.value, {
    infinite: props.infinite,
    vertical: props.vertical,
    transition: props.transition,
    transitionDuration: props.transitionDuration,
  });
});

const currentRenderedSlideIndex = computed(() => {
  return slides.value.findIndex((item) => item.props?.name === model.value);
});

/*
 * render SliderItem components via render functions
 */
const slider = computed(() => {
  return h(
    TransitionGroup,
    {
      tag: "div",
      class: "slider__content",
    },
    () =>
      slides.value.map((slide) => {
        return h(slide, {
          key: slide.props?.key,
          class: slide.props?.class,
          style: slide.props?.style,
        });
      }),
  );
});

/*
 * handle slide change
 */
const handeSlideChange = (direction: SlideChangeDirection) => {
  let newSlide =
    slides.value[
      currentRenderedSlideIndex.value + (direction === SlideChangeDirection.Forward ? 1 : -1)
    ];

  // autoplay is enabled & there aren't any slides further
  if (!newSlide && props.autoplay && Number(props.autoplayDuration) > 0) {
    // go back to the first slide
    newSlide = sliderItemsComponents.value[0];
  }

  if (newSlide) {
    model.value = newSlide.props?.name;

    // restart autoplay
    if (props.autoplay && Number(props.autoplayDuration) > 0) {
      runAutoplay();
    }
  }
};

const isNextSlideAvailable = computed(() => {
  return !!slides.value[currentRenderedSlideIndex.value + 1];
});

const isPreviousSlideAvailable = computed(() => {
  return !!slides.value[currentRenderedSlideIndex.value - 1];
});

/*
 * autoplay directive
 */
let autoplayTimeout: NodeJS.Timeout;

const runAutoplay = () => {
  if (autoplayTimeout) {
    clearTimeout(autoplayTimeout);
  }

  autoplayTimeout = setTimeout(() => {
    handeSlideChange(SlideChangeDirection.Forward);
  }, Number(props.autoplayDuration));
};

watch(
  [() => props.autoplay, () => props.autoplayDuration],
  ([newAutoplay, newAutoplayDuration]) => {
    if (newAutoplay && Number(newAutoplayDuration) > 0) {
      runAutoplay();
    }
  },
  { immediate: true },
);

/*
 * swipable directive
 */
const startHandlingSwipes = () => {
  if (!sliderContainer.value) return;

  // add touch events
  sliderContainer.value.addEventListener("touchstart", handleSwipeableTouchStart, false);
  sliderContainer.value.addEventListener(
    "touchmove",
    (event: any) => handleSwipeableTouchMove(event, props.vertical),
    false,
  );
  sliderContainer.value.addEventListener(
    "touchend",
    () => {
      const direction = handleSwipeableTouchEnd();
      if (direction) {
        handeSlideChange(direction);
      }
    },
    false,
  );

  // add mouse events
  sliderContainer.value.addEventListener("mousedown", handleSwipeableMouseDown, false);
  sliderContainer.value.addEventListener(
    "mousemove",
    (event: any) => handleSwipeableMouseMove(event, props.vertical),
    false,
  );
  sliderContainer.value.addEventListener(
    "mouseup",
    () => {
      const direction = handleSwipeableMouseEnd();
      if (direction) {
        handeSlideChange(direction);
      }
    },
    false,
  );
};

const stopHandlingSwipes = () => {
  if (!sliderContainer.value) return;

  // remove touch events
  sliderContainer.value.removeEventListener("touchstart", handleSwipeableTouchStart, false);
  sliderContainer.value.removeEventListener(
    "touchmove",
    (event: any) => handleSwipeableTouchMove(event, props.vertical),
    false,
  );
  sliderContainer.value.removeEventListener("touchend", () => handleSwipeableTouchEnd(), false);

  // remove mouse events
  sliderContainer.value.removeEventListener("mousedown", handleSwipeableMouseDown, false);
  sliderContainer.value.removeEventListener(
    "mousemove",
    (event: any) => handleSwipeableMouseMove(event, props.vertical),
    false,
  );
  sliderContainer.value.removeEventListener("mouseup", () => handleSwipeableMouseEnd(), false);
};

// watch for swipeable prop changes (start / end the autoplay)
watch(
  () => props.swipeable,
  (newValue, oldValue) => {
    if (!oldValue && newValue) {
      startHandlingSwipes();
    }

    if (oldValue && !newValue) {
      stopHandlingSwipes();
    }
  },
);

/*
 * life-cycle hooks
 */
onMounted(() => {
  // if no model value has been passed - set it to the first slide (* if exists)
  if (!model.value && sliderItemsComponents.value?.length) {
    model.value = sliderItemsComponents.value?.[0]?.props?.name;
  }

  // start autoplay if it's enabled
  if (props.autoplay && Number(props.autoplayDuration) > 0) {
    runAutoplay();
  }

  // start handling swipes if it's enabled
  if (props.swipeable) {
    startHandlingSwipes();
  }
});

onUnmounted(() => {
  // stop handling swipes
  stopHandlingSwipes();
});
</script>

<template>
  <div class="slider" ref="sliderContainer">
    <!-- slider -->
    <component :is="slider" />

    <!-- navigation arrows -->
    <ClientOnly>
      <div v-if="arrows" class="slider__arrows" :class="vertical ? 'slider__arrows--vertical' : ''">
        <!-- arrow back -->
        <button
          v-if="isPreviousSlideAvailable"
          @click="handeSlideChange(SlideChangeDirection.Backward)"
        >
          <IconsChevronLeft />
        </button>

        <div class="w-100"></div>

        <!-- arrow forward -->
        <button v-if="isNextSlideAvailable" @click="handeSlideChange(SlideChangeDirection.Forward)">
          <IconsChevronRight />
        </button>
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="scss">
.slider {
  max-width: 100%;
  overflow: hidden;
  position: relative;
  background: $white;

  .slider__content {
    position: relative;

    width: 100%;
    min-width: 100%;
    max-width: 100%;

    height: 100%;
    min-height: 100%;
    max-height: 100%;
  }

  .slider__arrows {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;

    z-index: 2;

    padding: $lg;

    @media screen and (max-width: $screen-mobile-width) {
      padding: $sm;
    }

    display: flex;
    align-items: center;
    justify-content: flex-end;

    &.slider__arrows--vertical {
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      button {
        transform: rotate(90deg);
      }
    }

    button {
      border: none;
      border-radius: 50%;
      width: 40px;
      max-width: 40px;
      height: 40px;
      max-height: 40px;
      cursor: pointer;
      padding: 0;
      pointer-events: all;

      display: flex;
      justify-content: center;
      align-items: center;

      aspect-ratio: 1/1;

      font-size: $xl;
      color: $black !important;
      background: rgba($white, 0.2) !important;
      backdrop-filter: blur(4px);

      &:active {
        outline: 2px solid $primary;
      }
    }
  }
}

.dark-mode .slider {
  background: $black;

  .slider__arrows {
    button {
      background: rgba($black, 0.2) !important;
      color: $white !important;
    }
  }
}
</style>
