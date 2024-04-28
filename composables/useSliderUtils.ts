import type { VNode } from "vue";
import SlideItem from "@/components/slider/item.vue";
import {
  SlideChangeDirection,
  type SlideChangeDirection as SlideChangeDirectionType,
  type SliderTransition as SliderTransitionType,
} from "@/enums/slider";

export const useSliderUtils = () => {
  /*
   * recursively search through a tree of virtual nodes (default slot)
   * collect all nodes of type SlideItem into an array
   */
  const findSliderItemComponents = (
    vnodes: Array<VNode>,
    items: Array<VNode> = [],
  ): Array<VNode> => {
    vnodes.forEach((vnode) => {
      if (vnode.type === SlideItem) {
        items.push(vnode);
      } else if (vnode.children && typeof vnode.children !== "string") {
        // cast vnode.children to Array<VNode> because children could be string | Array<VNode>
        findSliderItemComponents(vnode.children as Array<VNode>, items);
      }
    });
    return items;
  };

  /*
   * compute slides to render
   */
  const computeSlidesToRender = (
    sliderItemsComponents: VNode[],
    modelValue: string | number | null | undefined,
    props: {
      vertical: boolean;
      infinite: boolean;
      transition: SliderTransitionType | null;
      transitionDuration: string | number;
    },
  ) => {
    const currentSlideIndex = sliderItemsComponents.findIndex(
      (slide) => slide.props?.name === modelValue,
    );

    // leave only the previous, the current and the next slides
    let slidesToRender = sliderItemsComponents.filter(
      (slide, slideIndex) => Math.abs(slideIndex - currentSlideIndex) <= 1,
    );

    if (props.infinite) {
      // if current slide is the last one
      if (currentSlideIndex === sliderItemsComponents.length - 1) {
        // add the fist slide as the next one
        slidesToRender.push(sliderItemsComponents[0]);
      }

      // if current slide is the first one
      if (currentSlideIndex === 0) {
        // add the last slide as the next one
        slidesToRender.unshift(sliderItemsComponents[sliderItemsComponents.length - 1]);
      }
    }

    return slidesToRender.map((slide) => {
      let classList = "";

      // current slide
      const isCurrent = slide.props?.name === modelValue;
      if (isCurrent) {
        classList += "slider__item--current";
      }

      // previous slide
      const isPrevious =
        slide.props?.name === sliderItemsComponents?.[currentSlideIndex - 1]?.props?.name;
      const isPreviousInfinite =
        props.infinite &&
        currentSlideIndex === 0 &&
        slide.props?.name ===
          sliderItemsComponents?.[sliderItemsComponents.length - 1]?.props?.name;
      if (isPrevious || isPreviousInfinite) {
        classList += "slider__item--previous ";

        if (props.transition) {
          classList +=
            "slider__item--previous--" + props.transition + (props.vertical ? "--vertical" : "");
        }
      }

      // next slide
      const isNext =
        slide.props?.name === sliderItemsComponents?.[currentSlideIndex + 1]?.props?.name;
      const isNextInfinite =
        props.infinite &&
        currentSlideIndex === sliderItemsComponents.length - 1 &&
        slide.props?.name === sliderItemsComponents?.[0]?.props?.name;
      if (isNext || isNextInfinite) {
        classList += "slider__item--next ";

        if (props.transition) {
          classList +=
            "slider__item--next--" + props.transition + (props.vertical ? "--vertical" : "");
        }
      }

      // set slide transition property
      const styles = `transition: ${props.transition ? props.transitionDuration : 0}ms ease-in-out`;

      return {
        ...slide,
        props: {
          ...slide.props,
          key: slide.props?.name,
          class: classList,
          style: styles,
        },
      };
    });
  };

  /*
   * swipable directive - touch
   */
  const touchX1 = ref<number | null>(null);
  const touchY1 = ref<number | null>(null);
  const swipeSlideDirection = ref<SlideChangeDirectionType | null>(null);
  const SWIPE_OFFSET = 50;

  const handleSwipeableTouchStart = (event: any) => {
    // set initial touch position
    touchX1.value = event.touches[0].clientX;
    touchY1.value = event.touches[0].clientY;
  };

  const handleSwipeableTouchMove = (event: any, vertical: boolean) => {
    if (!touchX1.value || !touchY1.value) return;

    // set the following touches position
    let touchX2 = event.touches[0].clientX;
    let touchY2 = event.touches[0].clientY;

    // compute difference between touches on axes x, y
    let xDiff = touchX2 - touchX1.value;
    let yDiff = touchY2 - touchY1.value;

    // horizontal swipe
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (vertical) return;

      // swipe right
      if (xDiff > SWIPE_OFFSET) {
        swipeSlideDirection.value = SlideChangeDirection.Backward;

        // swipe left
      } else if (xDiff < -SWIPE_OFFSET) {
        swipeSlideDirection.value = SlideChangeDirection.Forward;
      }

      // vertical movement
    } else {
      if (!vertical) return;

      // swipe down
      if (yDiff > SWIPE_OFFSET) {
        swipeSlideDirection.value = SlideChangeDirection.Backward;

        // swipe up
      } else if (yDiff < -SWIPE_OFFSET) {
        swipeSlideDirection.value = SlideChangeDirection.Forward;
      }
    }
  };

  const handleSwipeableTouchEnd = () => {
    // reset initial touch position
    touchX1.value = null;
    touchY1.value = null;

    // return swipe direction in order to change the slide
    const direction = swipeSlideDirection.value;
    swipeSlideDirection.value = null;
    return direction;
  };

  /*
   * swipable directive - mouse
   */
  const mouseX1 = ref<number | null>(null);
  const mouseY1 = ref<number | null>(null);

  const handleSwipeableMouseDown = (event: any) => {
    // set the initial mouse position
    mouseX1.value = event.clientX;
    mouseY1.value = event.clientY;
  };

  const handleSwipeableMouseMove = (event: any, vertical: boolean) => {
    if (!mouseX1.value || !mouseY1.value) return;

    // set the following touches position
    let mouseX2 = event.clientX;
    let mouseY2 = event.clientY;

    // compute difference between touches on axes x, y
    let xDiff = mouseX2 - mouseX1.value;
    let yDiff = mouseY2 - mouseY1.value;

    // horizontal swipe
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (vertical) return;

      // swipe right
      if (xDiff > SWIPE_OFFSET) {
        swipeSlideDirection.value = SlideChangeDirection.Backward;

        // swipe left
      } else if (xDiff < -SWIPE_OFFSET) {
        swipeSlideDirection.value = SlideChangeDirection.Forward;
      }

      // vertical movement
    } else {
      if (!vertical) return;

      // swipe down
      if (yDiff > SWIPE_OFFSET) {
        swipeSlideDirection.value = SlideChangeDirection.Backward;

        // swipe up
      } else if (yDiff < -SWIPE_OFFSET) {
        swipeSlideDirection.value = SlideChangeDirection.Forward;
      }
    }
  };

  const handleSwipeableMouseEnd = () => {
    // reset initial mouse down position
    mouseX1.value = null;
    mouseY1.value = null;

    // return swipe direction in order to change the slide
    const direction = swipeSlideDirection.value;
    swipeSlideDirection.value = null;
    return direction;
  };

  /*
   * export
   */
  return {
    findSliderItemComponents,
    computeSlidesToRender,
    handleSwipeableTouchStart,
    handleSwipeableTouchMove,
    handleSwipeableTouchEnd,
    handleSwipeableMouseDown,
    handleSwipeableMouseMove,
    handleSwipeableMouseEnd,
  };
};
