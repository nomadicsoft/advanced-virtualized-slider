<script setup lang="ts">
defineProps({
  modelValue: { type: [Boolean] },
  name: { type: [String], required: true },
  disabled: { type: Boolean },
});

const emit = defineEmits(["update:modelValue"]);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    emit("update:modelValue", target.checked);
  }
};
</script>

<template>
  <div class="switch__wrapper">
    <input
      type="checkbox"
      :checked="modelValue"
      :id="name"
      :disabled="disabled"
      class="checkbox"
      @change="handleChange"
    />
    <label
      :for="name"
      class="switch cursor-pointer"
      :class="{ 'switch--disabled': disabled }"
    ></label>
  </div>
</template>

<style scoped lang="scss">
.switch__wrapper {
  display: flex;
  align-items: center;

  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    background-color: $light-grey;
    border-radius: 16px;
    cursor: pointer;

    &.switch--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &::after {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: white;
      top: 4px;
      left: 4px;
      transition: all 0.3s;
    }
  }
}

.dark-mode .switch {
  background-color: $grey;
}
.dark-mode .switch::after {
  background-color: $white;
}
.dark-mode .checkbox:checked + .switch:after {
  background-color: $white;
}

.checkbox {
  display: none;
}
.checkbox:checked + .switch::after {
  left: 24px;
}
.checkbox:checked + .switch {
  background-color: $primary;
}
</style>
