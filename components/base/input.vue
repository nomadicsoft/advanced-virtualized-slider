<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  modelValue: { type: [String, Number] as PropType<string | number | null>, default: "" },
  type: { type: String, default: "text" },
  suffix: { type: String },
  placeholder: { type: String },
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    emit("update:modelValue", target.value);
  }
};
</script>

<template>
  <div class="relative">
    <input :value="modelValue" :type="type" @input="handleInput" :placeholder="placeholder" />

    <span v-if="suffix" class="suffix text-caption">{{ suffix }}</span>
  </div>
</template>

<style scoped lang="scss">
input {
  border-radius: $sm;
  padding: $sm;
  border: 1px solid $light-grey;
  background: $white;
  color: $black;
  width: 100%;

  &:focus {
    border-color: $primary !important;
    outline: 2px solid rgba($primary, 0.5);
  }
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.dark-mode input {
  border: 1px solid $grey;
  background: $black;
  color: $white;
}

.suffix {
  position: absolute;
  right: 10px;
  top: 0;
  bottom: 0;
  margin: auto;
  font-size: 0.75rem;
  height: fit-content;
  pointer-events: none;
}
</style>
