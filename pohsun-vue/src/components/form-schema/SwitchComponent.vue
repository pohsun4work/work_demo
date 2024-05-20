<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  schema: { type: Object, required: true }
})
const model = defineModel()

onMounted(() => (model.value = model.value ?? props.schema.options[1]))
</script>

<template>
  <span class="fs-switch">
    <input
      type="radio"
      :value="props.schema.options[0]"
      :name="props.schema.name"
      :id="`${props.schema.key}_a`"
      v-model="model"
      class="fs-component__input fs-switch__input fs-switch__firstOption"
    />
    <input
      type="radio"
      :value="props.schema.options[1]"
      :name="props.schema.name"
      :id="`${props.schema.key}_b`"
      v-model="model"
      class="fs-component__input fs-switch__input"
    />
    <label
      :for="`${props.schema.key}_${model === props.schema.options[0] ? 'b' : 'a'}`"
      class="fs-component__inputFocusTarget fs-switch__switch"
    ></label>
  </span>
</template>

<style scoped>
.fs-switch {
  --fs-switch-size: calc(var(--fs-size) * 0.9);
  --fs-switch-padding: 2px;
  --fs-switch-second: 0.2s;

  display: grid;
  align-items: center;
}

.fs-switch__input,
.fs-switch__switch {
  grid-area: 1 / 1 / 2 / 2;
}

.fs-switch__input {
  width: 0;
  height: 0;
}

.fs-switch__switch {
  position: relative;
  display: inline-block;
  width: calc(var(--fs-switch-size) * 2);
  height: calc(var(--fs-switch-size));
  border-radius: 9999px;
  background-color: #bbb;
  transition: background-color var(--fs-switch-second) linear;
}

.fs-switch__switch::after {
  position: absolute;
  content: '';
  width: calc(var(--fs-switch-size) - var(--fs-switch-padding) * 2);
  height: calc(var(--fs-switch-size) - var(--fs-switch-padding) * 2);
  border-radius: 50%;
  background-color: #fff;
  transform: translate(var(--fs-switch-padding), var(--fs-switch-padding));
  transition: transform var(--fs-switch-second) linear;
}

.fs-switch__firstOption:checked ~ .fs-switch__switch {
  background-color: var(--fs-main-color);
}

.fs-switch__firstOption:checked ~ .fs-switch__switch::after {
  transform: translate(
    calc(var(--fs-switch-size) + var(--fs-switch-padding)),
    var(--fs-switch-padding)
  );
}
</style>
