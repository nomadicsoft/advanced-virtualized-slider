<script setup lang="ts">
import type { PropType } from "vue";
import { BACKGROUND_COLORS, BACKGROUNDS } from "@/constants/slider";
import { SliderTransition } from "@/enums/slider";
import type { SliderSettingsType, SlideType } from "@/types/slides";
import { useImageUtils } from "~/composables/useImageUtils";

/*
 * composables
 */
const { convertToBase64 } = useImageUtils();

/*
 * emits
 */
const emit = defineEmits(["update:slides", "update:slide", "update:slideSettings"]);

/*
 * props
 */
const props = defineProps({
  slides: { type: Array as PropType<SlideType[]>, required: true },
  slide: { type: [String, Number] },
  slideSettings: {
    type: Object as PropType<SliderSettingsType>,
    required: true,
    default: {
      arrows: true,
      transition: SliderTransition.Slide,
      transitionDuration: 300,
      infinite: false,
      autoplay: false,
      autoplayDuration: 3000,
      vertical: false,
      swipeable: true,
    },
  },
});

/*
 * data: slide, slides, slide settings
 */
const slide = ref<string | number | undefined>(props.slide);
const slides = ref<Array<SlideType>>(props.slides);
const slideSettings = ref<SliderSettingsType>(props.slideSettings);

watchEffect(() => {
  slide.value = props.slide;
  slides.value = props.slides;
  slideSettings.value = props.slideSettings;
});

/*
 * current slide
 * current slide index
 */
const currentSlide = computed(() => {
  return slides.value.find((item) => item.name === slide.value);
});

const currentSlideIndex = computed(() => {
  return slides.value.findIndex((item) => item.name === slide.value);
});

/*
 * manage slides (add, remove)
 */
const addNewSlide = () => {
  const newSlide: SlideType = {
    name: slides.value.length + 1,
    imgSrc: null,
    backgroundColor: null,
    text: "New Slide",
  };

  slides.value.splice(currentSlideIndex.value + 1, 0, newSlide);
  emit("update:slides", slides.value);

  slide.value = newSlide.name;
  emit("update:slide", slide.value);
};

const removeCurrentSlide = () => {
  if (!isSlideRemoveAvailable.value) return;

  const slideToRemoveName = slide.value;

  slide.value = slides.value[currentSlideIndex.value - 1]
    ? slides.value[currentSlideIndex.value - 1].name
    : slides.value[currentSlideIndex.value + 1].name;
  emit("update:slide", slide.value);

  slides.value = slides.value.filter((item) => item.name !== slideToRemoveName);
  emit("update:slides", slides.value);
};

const isSlideRemoveAvailable = computed(() => {
  return props.slides.length > 1;
});

/*
 * change slide background
 */
const handleSetBackground = (src: string | null = null) => {
  if (currentSlideIndex.value !== -1) {
    slides.value[currentSlideIndex.value].imgSrc = src;
    emit("update:slides", slides.value);
  }
};

/*
 * upload background
 */
const fileInput = ref<HTMLElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  if (file) {
    const base64 = await convertToBase64(file);
    handleSetBackground(base64);
  }
};

const availableBackgrounds = computed(() => {
  const BACKGROUND_SRCs = new Set(BACKGROUNDS.map((background) => background.src));
  let uploadedBackgrounds: Array<{ src: string | null; label: string }> = [];

  slides.value
    .filter((item) => item.imgSrc && !BACKGROUND_SRCs.has(item.imgSrc))
    .forEach((item) => {
      if (!uploadedBackgrounds.some((uploaded) => uploaded.src === item.imgSrc)) {
        uploadedBackgrounds.push({
          src: item.imgSrc,
          label: "Upload " + uploadedBackgrounds.length,
        });
      }
    });

  return [...BACKGROUNDS, ...uploadedBackgrounds];
});

// turn off "infinite" setting if there are less than 3 slides
watch(
  () => slides.value,
  () => {
    if (slides.value.length < 3 && slideSettings.value.infinite) {
      slideSettings.value.infinite = false;
    }
  },
);
</script>

<template>
  <div class="container">
    <!-- content -->
    <div class="content">
      <template v-if="slides[currentSlideIndex]">
        <!-- slide text -->
        <BaseInput
          v-model="slides[currentSlideIndex].text"
          placeholder="Slide text"
          class="w-100"
        />

        <!-- color -->
        <BaseSelect
          v-model="slides[currentSlideIndex].backgroundColor"
          :options="BACKGROUND_COLORS"
          :class="`background_color_select--${slides[currentSlideIndex].backgroundColor}`"
        />

        <!-- remove current slide -->
        <button :disabled="!isSlideRemoveAvailable" @click="removeCurrentSlide()">
          <IconsBin />
        </button>
      </template>

      <template v-else>
        <div class="w-100"></div>
      </template>

      <!-- add new slide -->
      <button @click="addNewSlide()">
        <IconsAdd />
      </button>
    </div>

    <template v-if="slides[currentSlideIndex]">
      <!-- backgrounds -->
      <div>
        <h3 class="text-bold">Backgrounds</h3>

        <div class="backgrounds no-scrollbar">
          <ClientOnly>
            <!-- reset current slide background -->
            <div class="backgrounds__background" @click="handleSetBackground()">
              <div
                class="backgrounds__background__preview"
                :class="`${!currentSlide?.imgSrc ? 'backgrounds__background__preview--active' : ''} background_color_select--${slides[currentSlideIndex].backgroundColor}`"
              >
                <IconsNoneValue />
              </div>
              <div class="text-center text-caption">None</div>
            </div>

            <!-- select current slide background -->
            <div
              v-for="background in availableBackgrounds"
              :key="background.label"
              class="backgrounds__background"
              @click="handleSetBackground(background.src)"
            >
              <div
                class="backgrounds__background__preview"
                :class="`${currentSlide?.imgSrc === background.src ? 'backgrounds__background__preview--active' : ''} background_color_select--${slides[currentSlideIndex].backgroundColor}`"
              >
                <img v-if="background.src" :src="background.src" :alt="background.label" />
              </div>
              <div class="text-center text-caption">{{ background.label }}</div>
            </div>

            <!-- upload slide background -->
            <div class="backgrounds__background" @click="triggerFileInput">
              <div
                class="backgrounds__background__preview"
                :class="`background_color_select--${slides[currentSlideIndex].backgroundColor}`"
              >
                <IconsAdd />
              </div>
              <div class="text-center text-caption text-primary">Upload</div>

              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleFileChange"
              />
            </div>
          </ClientOnly>
        </div>
      </div>

      <!-- settings -->
      <div>
        <h3 class="text-bold">Settings</h3>

        <div class="settings">
          <div>
            <!-- arrows -->
            <div class="settings__item">
              <div class="settings__item__title">
                Show arrows {{ slideSettings.vertical ? "(vertically)" : "(horizontally)" }}
              </div>
              <BaseToggleSwitch v-model="slideSettings.arrows" name="arrows" />
            </div>

            <!-- infinite -->
            <div class="settings__item">
              <div class="settings__item__title">Infinite</div>
              <BaseToggleSwitch
                v-model="slideSettings.infinite"
                :disabled="slides.length < 3"
                name="infinite"
              />
            </div>

            <!-- vertical -->
            <div class="settings__item">
              <div class="settings__item__title">Vertical</div>
              <BaseToggleSwitch v-model="slideSettings.vertical" name="vertical" />
            </div>

            <!-- swipeable -->
            <div class="settings__item">
              <div class="settings__item__title">Swipeable</div>
              <BaseToggleSwitch v-model="slideSettings.swipeable" name="swipeable" />
            </div>
          </div>

          <hr />

          <div>
            <!-- transition -->
            <div class="settings__item">
              <div class="settings__item__title">Transition</div>
              <BaseSelect
                v-model="slideSettings.transition"
                :options="[
                  { name: 'slide', label: 'Slide' },
                  { name: 'fade', label: 'Fade' },
                ]"
              />
            </div>

            <!-- transition duration -->
            <div class="settings__item">
              <div class="settings__item__title">Transition duration (ms)</div>
              <BaseInput
                v-model="slideSettings.transitionDuration"
                type="number"
                suffix="ms"
                style="max-width: 75px"
              />
            </div>

            <!-- autoplay -->
            <div class="settings__item">
              <div class="settings__item__title">Autoplay</div>
              <BaseToggleSwitch v-model="slideSettings.autoplay" name="autoplay" />
            </div>

            <!-- autoplay duration -->
            <div class="settings__item">
              <div class="settings__item__title">Autoplay duration (ms)</div>
              <BaseInput
                v-model="slideSettings.autoplayDuration"
                type="number"
                suffix="ms"
                style="max-width: 75px"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin-top: $xxl;
  padding: 0 $lg;
  display: flex;
  flex-direction: column;
  gap: $xl;

  @media screen and (max-width: $screen-mobile-width) {
    padding: 0;
  }

  h3 {
    margin-bottom: $md;
  }

  .settings {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    gap: $xl;

    @media screen and (max-width: $screen-mobile-width) {
      grid-template-columns: 1fr;
      gap: $md;

      hr {
        display: none;
      }
    }

    > div {
      display: flex;
      flex-direction: column;
      gap: $md;
    }

    hr {
      height: 100%;
      width: 1px;
      background: $light-grey;
      border: none;
    }

    .settings__item {
      min-height: 33px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .settings__item__title {
        font-size: 0.875rem;
        color: $grey;
      }
    }
  }
}

.dark-mode .container .settings .settings__item .settings__item__title {
  color: $light-grey;
}

/*
 * backgrounds
 */
.backgrounds {
  display: flex;
  gap: $lg;
  overflow-x: scroll;
  cursor: pointer;
  padding: $xs;
  margin-left: -$xs;

  .backgrounds__background {
    .backgrounds__background__preview {
      width: 100px;
      height: 100px;
      border-radius: $sm;
      border: 1px solid $grey;
      outline: 2px solid transparent;
      overflow: hidden;
      margin-bottom: $sm;

      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      svg {
        font-size: 2rem;
        opacity: 0.5;
      }

      &.backgrounds__background__preview--active {
        border-color: $primary;
        outline: 2px solid rgba($primary, 0.5);
      }
    }

    &:active {
      .backgrounds__background__preview {
        border-color: $primary;
        outline: 2px solid rgba($primary, 0.5);
      }
    }
  }
}

/*
 * content
 */
.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $md;

  @media screen and (max-width: $screen-mobile-width) {
    flex-wrap: wrap;
    justify-content: center;

    > div:first-child {
      flex: 1 0 100%;
    }
  }

  button {
    border-radius: $sm;
    background: $white;
    color: $black;
    border: 1px solid $light-grey;
    outline: 2px solid transparent;
    aspect-ratio: 1/1;
    height: 33.5px;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:disabled {
      cursor: not-allowed;
      color: $light-grey;

      &:active {
        border-color: $light-grey;
        outline: 2px solid transparent;
      }
    }

    &:active {
      border-color: $primary;
      outline: 2px solid rgba($primary, 0.5);
    }
  }
}

.dark-mode .content button {
  border-color: $grey;
  background: $black;
  color: $white;

  &:disabled {
    cursor: not-allowed;
    color: $grey;

    &:active {
      border-color: $grey;
      outline: 2px solid transparent;
    }
  }
}

/*
 * background color selection
 */
.background_color_select--white {
  background: $white !important;
  color: $black !important;
}
.background_color_select--black {
  background: $black !important;
  color: $white !important;
}
.background_color_select--grey {
  background: $grey !important;
  color: $white !important;
}
.background_color_select--red {
  background: $red !important;
  color: $white !important;
}
.background_color_select--amber {
  background: $amber !important;
  color: $white !important;
}
.background_color_select--green {
  background: $green !important;
  color: $white !important;
}
.background_color_select--blue {
  background: $blue !important;
  color: $white !important;
}
</style>
