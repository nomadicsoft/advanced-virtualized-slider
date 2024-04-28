<script setup lang="ts">
import { ref } from "vue";

const colorMode = useColorMode();
const COLOR_MODES = { SYSTEM: "system", LIGHT: "light", DARK: "dark" };
const currentModeIndex = ref(0);

const toggleColorMode = () => {
  currentModeIndex.value = (currentModeIndex.value + 1) % Object.values(COLOR_MODES).length;
  colorMode.preference = Object.values(COLOR_MODES)[currentModeIndex.value];
};
</script>

<template>
  <div class="container">
    <header>
      <div class="header__top">
        <!-- logo -->
        <ClientOnly>
          <IconsLogo class="logo" />
        </ClientOnly>

        <!-- title -->
        <h2 class="text-no-wrap">
          <span class="text-bold"> Advanced </span>
          <span class="relative highlighted_text text-bold">
            Virtualized

            <svg
              class="absolute-center w-100 underline_svg"
              style="top: 120%"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 800 400"
            >
              <path
                d="M30.538921356201172,197.60479736328125C55.88822364807129,193.61278025309244,133.1337350209554,173.45309448242188,182.63473510742188,173.65269470214844C232.13573519388834,173.852294921875,269.6606903076172,199.20159912109375,327.544921875,198.80239868164062C385.4291534423828,198.4031982421875,465.0698649088542,172.4550984700521,529.9401245117188,171.2574920654297C594.8103841145834,170.05988566080728,674.0519104003906,190.41915639241537,716.7664794921875,191.61676025390625C759.4810485839844,192.81436411539713,774.6506958007812,180.63872273763022,786.2275390625,178.443115234375"
                fill="none"
                stroke-width="25"
                stroke-linecap="round"
                transform="matrix(1,0,0,1,-8.383220672607422,14.993125915527344)"
              ></path>
              <defs>
                <linearGradient id="SvgjsLinearGradient1004">
                  <stop stop-color="hsl(37, 99%, 67%)" offset="0"></stop>
                  <stop stop-color="hsl(316, 73%, 52%)" offset="1"></stop>
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span class="text-bold">Slider</span>
        </h2>

        <div class="w-100" />

        <!-- color mode toggle -->
        <button @click="toggleColorMode()" class="mode">
          <ClientOnly>
            <IconsLightMode v-if="$colorMode.preference === COLOR_MODES.LIGHT" />
            <IconsDarkMode v-else-if="$colorMode.preference === COLOR_MODES.DARK" />
            <IconsAutoMode v-else-if="$colorMode.preference === COLOR_MODES.SYSTEM" />
          </ClientOnly>
        </button>
      </div>

      <div class="text-caption">
        An advanced virtualized slider app designed for optimal performance, seamlessly integrating
        mixed content for responsive and highly optimized web experiences.
      </div>
    </header>

    <slot />
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: calc(800px + 2 * $lg);
  width: 100%;
  margin: 0 auto;
  padding: $xxl $lg;
}

header {
  padding: 0 $lg;
  margin-bottom: $xxl;

  @media screen and (max-width: $screen-mobile-width) {
    padding: 0;
  }

  .header__top {
    display: flex;
    align-items: center;

    @media screen and (max-width: $screen-mobile-width) {
      h2 {
        span:first-child {
          display: none;
        }
      }
    }

    .logo {
      height: 30px;
      width: 60px;
      min-width: 60px;
      margin-right: $md;

      @media screen and (max-width: $screen-mobile-width) {
        margin-right: $sm;
      }
    }
  }

  .text-caption {
    margin-top: $md;
  }
}

button {
  border: none;
  background: none;
  aspect-ratio: 1/1;
  cursor: pointer;
  border-radius: $sm;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: 2px solid transparent;
  transition: background-color 0.3s;

  svg {
    width: 24px;
    height: 24px;
    color: $black;
  }

  &:active {
    outline: 2px solid $primary;
  }

  &:hover {
    background: rgba($black, 0.1);
  }
}

.dark-mode button {
  svg {
    color: $white;
  }

  &:hover {
    background: rgba($white, 0.1);
  }
}

/*
 * highlighted text
 */
.highlighted_text {
  color: $black;
  opacity: 0.5;
}

.dark-mode .highlighted_text {
  color: $white;
}

/*
 * underline svg animation
 */
.underline_svg {
  path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    stroke: $black;

    animation-name: waveAnimation;
    animation-duration: 6s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;

    @keyframes waveAnimation {
      0% {
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      40% {
        opacity: 0;
      }
      50%,
      100% {
        stroke-dashoffset: 0;
        opacity: 0;
      }
    }
  }
}

.dark-mode .underline_svg {
  path {
    stroke: $white;
  }
}
</style>
