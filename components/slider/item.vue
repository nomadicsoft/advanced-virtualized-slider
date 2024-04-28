<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  name: { type: [String, Number], required: true },
  imgSrc: { type: String as PropType<string | null> },
  backgroundColor: { type: String as PropType<string | null> },
});
</script>

<template>
  <div class="slider__item" :class="`${backgroundColor ? `slider__item--${backgroundColor}` : ''}`">
    <div class="slider__item__content relative w-100 h-100">
      <img
        v-if="imgSrc"
        :src="imgSrc"
        :alt="`${name} background`"
        class="slider__item__background"
      />

      <div class="slider__item__content__slot">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.slider__item {
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;

  &.slider__item--white {
    background: $white;
    color: $black;
  }
  &.slider__item--black {
    background: $black;
    color: $white;
  }
  &.slider__item--grey {
    background: $grey;
    color: $white;
  }
  &.slider__item--red {
    background: $red;
    color: $white;
  }
  &.slider__item--amber {
    background: $amber;
    color: $white;
  }
  &.slider__item--green {
    background: $green;
    color: $white;
  }
  &.slider__item--blue {
    background: $blue;
    color: $white;
  }

  .slider__item__content {
    position: relative;
    width: 100%;
    height: 100%;

    .slider__item__background {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .slider__item__content__slot {
      z-index: 1;
    }
  }

  &.slider__item--current {
    top: 0;
    left: 0;
    opacity: 1;
  }

  // default
  &.slider__item--previous {
    top: 0;
    left: -100%;
  }
  &.slider__item--next {
    top: 0;
    left: 100%;
  }

  // default - vertical
  &.slider__item--previous {
    top: -100%;
    left: 0;
  }
  &.slider__item--next {
    top: 100%;
    left: 0;
  }

  // slide transition
  &.slider__item--previous--slide {
    top: 0;
    left: -100%;
  }
  &.slider__item--next--slide {
    top: 0;
    left: 100%;
  }

  // slide transition - vertical
  &.slider__item--previous--slide--vertical {
    top: -100%;
    left: 0;
  }
  &.slider__item--next--slide--vertical {
    top: 100%;
    left: 0;
  }

  // fade transition
  &.slider__item--previous--fade {
    opacity: 0;
    top: 0;
    left: 0;
  }
  &.slider__item--next--fade {
    opacity: 0;
    top: 0;
    left: 0;
  }

  // fade transition - vertical
  &.slider__item--previous--fade--vertical {
    opacity: 0;
    top: 0;
    left: 0;
  }
  &.slider__item--next--fade--vertical {
    opacity: 0;
    top: 0;
    left: 0;
  }
}
</style>
