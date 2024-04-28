<script setup lang="ts">
import { BACKGROUNDS } from "@/constants/slider";
import { BackgroundColor } from "@/enums/slider";
import type { SliderSettingsType, SlideType } from "@/types/slides";

useHead({
  title: "Advanced Virtualized Slider",
  meta: [
    {
      name: "description",
      content:
        "An advanced virtualized slider app designed for optimal performance, seamlessly integrating mixed content for responsive and highly optimized web experiences.",
    },
  ],
});

/*
 * slides, settings
 */
const slide = ref<string | number>();

const slideSettings = ref<SliderSettingsType>({
  arrows: true,
  transition: null,
  transitionDuration: 300,
  infinite: false,
  autoplay: false,
  autoplayDuration: 3000,
  vertical: false,
  swipeable: true,
});

const slides = ref<Array<SlideType>>([
  {
    name: "welcome",
    imgSrc: BACKGROUNDS?.[0]?.src,
    backgroundColor: null,
    text: "",
  },
  {
    name: "nomadic-soft",
    imgSrc: BACKGROUNDS?.[1]?.src,
    backgroundColor: BackgroundColor.Black,
    text: "Nomadic Soft",
  },
  {
    name: "final",
    imgSrc: BACKGROUNDS?.[2]?.src,
    backgroundColor: BackgroundColor.Black,
    text: "Made with ❤️ for people!",
  },
]);
</script>

<template>
  <div>
    <!-- slider -->
    <Slider
      v-model="slide"
      :arrows="slideSettings.arrows"
      :transition="slideSettings.transition"
      :transition-duration="slideSettings.transitionDuration"
      :infinite="slideSettings.infinite"
      :autoplay="slideSettings.autoplay"
      :autoplay-duration="slideSettings.autoplayDuration"
      :vertical="slideSettings.vertical"
      :swipeable="slideSettings.swipeable"
    >
      <SliderItem
        v-for="item in slides"
        :key="item.name"
        :img-src="item.imgSrc"
        :background-color="item.backgroundColor"
        :name="item.name"
      >
        <!-- slide text -->
        <span v-if="typeof item.name === 'number' || !item.name.includes('nomadic-soft')">
          {{ item.text }}
        </span>

        <!-- contact form -->
        <div v-else class="contact_form">
          <a href="https://nomadicsoft.io" target="_blank">
            <img src="@/assets/images/nomadic_soft_logo.png" alt="Nomadic Soft Logo" />
          </a>

          <a href="https://nomadicsoft.io" target="_blank">
            <div class="contact_form__title">Nomadic soft</div>
          </a>

          <a href="mailto:hello@nomadicsoft.io" target="_blank" class="contact_form__email">
            hello@nomadicsoft.io
          </a>

          <a href="https://nomadicsoft.io" target="_blank" class="w-100">
            <button>Contact Us</button>
          </a>
        </div>
      </SliderItem>
    </Slider>

    <!-- settings -->
    <SliderSettings
      :slide="slide"
      :slides="slides"
      :slide-settings="slideSettings"
      @update:slide="slide = $event"
      @update:slideSettings="slideSettings = $event"
      @update:slides="slides = $event"
    />
  </div>
</template>

<style lang="scss">
.contact_form {
  display: flex;
  flex-direction: column;
  align-items: center;

  background: rgba($black, 0.2);
  backdrop-filter: blur(20px);
  padding: $xl;
  border-radius: $md;
  overflow: hidden;

  img {
    border-radius: $md;
    width: 60px;
    height: 60px;
    transition: 0.3s;

    &:active {
      transform: scale(0.9);
    }
  }

  a {
    text-decoration: none;
  }

  .contact_form__title {
    font-weight: 500;
    font-size: 24px;
    margin-top: $sm;
    color: $white;
  }

  .contact_form__email {
    font-size: 14px;
    opacity: 50%;
    color: $white;
    text-decoration: underline;
  }

  button {
    background: $white;
    border-radius: $sm;
    border: none;
    padding: $sm $md;
    margin-top: $md;
    width: 100%;
    cursor: pointer;

    &:active {
      outline: 2px solid $primary;
    }
  }
}
/*
 * custom slider customization
 */
.slider {
  aspect-ratio: 16/9;
  border: 1px solid $grey;
  border-radius: $md;

  .slider__item__content {
    padding: $xl;

    display: flex;
    justify-content: center;
    align-items: center;

    span {
      font-size: 1.25rem;
      font-weight: 500;
    }
  }
}

.dark-mode .slider {
  border: 1px solid $grey;
}
</style>
