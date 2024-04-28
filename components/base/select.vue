<script setup lang="ts">
import type { PropType } from "vue";

interface OptionItem {
  name: string;
  label: string;
}

defineProps({
  modelValue: { type: [String, Number] as PropType<string | number | null>, default: "" },
  options: { type: Array as PropType<OptionItem[]>, default: () => [] },
  placeholder: { type: String, default: "None" },
  error: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    emit("update:modelValue", target.value);
  }
};
</script>

<template>
  <select :value="modelValue" @change="handleChange">
    <option value="">{{ placeholder }}</option>

    <option v-for="option in options" :key="option.name" :value="option.name">
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped lang="scss">
select {
  border-radius: $sm;
  padding: calc($sm - 1px) $sm;
  border: 1px solid $light-grey;
  background: $white;
  color: $black;
  height: 33px;

  &:focus {
    border-color: $primary !important;
    outline: 2px solid rgba($primary, 0.5);
  }
}

.dark-mode select {
  border-color: $grey;
  background: $black;
  color: $white;
}
</style>
