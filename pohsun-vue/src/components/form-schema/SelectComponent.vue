<script setup>
import { ref, computed, watchEffect } from 'vue'
import CollapseFunc from './CollapseFunc.vue'

const props = defineProps({
  schema: { type: Object, required: true }
})
const model = defineModel()

const collapseOpen = ref(false)
const collapseEL = ref(null)
const inputModel = ref('')
const placeholderValue = ref('')
const isEraseIcon = computed(() => inputModel.value)
const filterOptions = computed(() =>
  props.schema.options.filter(({ label: l }) => l.includes(inputModel.value))
)

const changeByModel = () => {
  const selected = props.schema.options.find(({ value: v }) => v === model.value)
  placeholderValue.value = selected?.label ?? props.schema.placeholder
  // 等collapse結束才修改inputModel，避免collapse閃爍
  setTimeout(() => (inputModel.value = selected?.label ?? ''), 300)
}

const focusInput = () => {
  inputModel.value = ''
  collapseOpen.value = true
}
const blurInput = (e) => {
  // blur觸發在ul裡面，視為沒有blur
  if (e?.relatedTarget === collapseEL.value) return

  collapseOpen.value = false

  // blur不是觸發在ul裡面，對inputModel重新賦值
  if (e?.relatedTarget !== collapseEL.value) changeByModel()
}

const selectOption = (option) => {
  model.value = option.value
  blurInput(null)
}
const eraseOption = () => (model.value = undefined)

watchEffect(() => changeByModel())
</script>

<template>
  <span>
    <span class="fs-select__inputBox">
      <input
        type="text"
        :placeholder="placeholderValue"
        :id="props.schema.key"
        class="fs-component__input fs-component__inputFocusTarget fs-select__input"
        v-model="inputModel"
        @focus="() => focusInput()"
        @blur="(e) => blurInput(e)"
      />
      <span v-if="isEraseIcon" class="fs-select__eraseIcon" @click="() => eraseOption()"></span>
      <span v-else class="fs-select__arrowIcon"></span>
    </span>
    <CollapseFunc :open="collapseOpen">
      <ul class="fs-select__options" ref="collapseEL" tabindex="-1">
        <li
          v-for="option in filterOptions"
          :key="option.value"
          class="fs-select__option"
          @click="() => selectOption(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </CollapseFunc>
  </span>
</template>

<style scoped>
.fs-select__inputBox {
  position: relative;
}

.fs-select__eraseIcon::after {
  position: absolute;
  right: 7.5px;
  margin-top: 10px;
  content: '×';
  font-size: calc(var(--fs-fontSize) * 1.5);
}

.fs-select__arrowIcon::after {
  position: absolute;
  right: 7.5px;
  margin-top: 10px;
  content: '▼';
  pointer-events: none;
}
</style>
