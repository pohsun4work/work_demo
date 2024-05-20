<script setup>
import { ref, computed, watchEffect, watch } from 'vue'
import CollapseFunc from './CollapseFunc.vue'

const props = defineProps({
  schema: { type: Object, required: true },
  disabled: { type: Boolean },
  sid: { type: Boolean },
  change: { type: Function }
})
const model = defineModel()

const collapseOpen = ref(false)
const collapseEL = ref(null)
const inputModel = ref('')
const placeholderValue = ref('')
const isEraseIcon = computed(() => props.disabled ? null : inputModel.value)
const filterOptions = computed(() =>
  props.schema.options.filter(({ value: l }) => l.includes(inputModel.value))
)

watch(() => props.schema.options, () => {
  props.schema.options.filter(({ value: l }) => l.includes(inputModel.value))
  // console.log(props.schema.options, 'props.opt')
}, { deep: true })


const changeByModel = () => {
  const selected = props.sid ? props.schema.options.find(({ sid: v }) => v === model.value) : props.schema.options.find(({ id: v }) => v === model.value)
  placeholderValue.value = selected?.value ?? props.schema.placeholder
  // 等collapse結束才修改inputModel，避免collapse閃爍
  setTimeout(() => (inputModel.value = selected?.value ?? ''), 300)
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
  props.sid ? model.value = option.sid : model.value = option.id
  blurInput(null)
}
const eraseOption = () => (model.value = undefined)

watchEffect(() => changeByModel())

</script>

<template>
  <div class="mt-1">
    <span class="fs-select__inputBox ">
      <input :disabled="props.disabled" type="text" :placeholder="placeholderValue" :id="props.schema.key"
        class="fs-component__input fs-component__inputFocusTarget fs-select__input" v-model="inputModel"
        @focus="() => focusInput()" @blur="(e) => blurInput(e)" />
      <span v-if="isEraseIcon" class="fs-select__eraseIcon" @click="() => eraseOption()"></span>
      <span v-else class="fs-select__arrowIcon"></span>
    </span>
    <CollapseFunc :open="collapseOpen">
      <ul class="fs-select__options" ref="collapseEL" tabindex="-1">
        <li v-for="option in filterOptions" :key="option.id" class="fs-select__option"
          @click="() => selectOption(option)">
          {{ option.value }}
        </li>
      </ul>
    </CollapseFunc>
  </div>
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

.fs-component__input ::after {
  border: 1px darkblue salmon;
}

.fs-select__options {
  outline: 1px auto #c1430d;
}

.fs-component__input {
  padding: 10px;
  width: 100%;
  min-width: max-content;
  font-size: inherit;
  line-height: inherit;
  border-radius: 15px;
  border: 1px solid black;
  outline: none;
  accent-color: #c1430d;
}


.fs-select__input,
.fs-multi {
  transition: border-radius var(--fs-select-second) linear;
}

.fs-select__input:focus,
.fs-multi:has(.fs-multi__input:focus) {
  border-end-start-radius: 0;
  border-end-end-radius: 0;
  border-color: var(--fs-main-color);
}


/* focus樣式 */
.fs-component__input:focus.fs-component__inputFocusTarget,
.fs-component__input:focus~.fs-component__inputFocusTarget,
/* for switch */
.fs-component__inputFocusTarget:has(.fs-component__input:focus)

/* for multi-select */
  {
  outline: 1px auto #c1430d;
  /* border-color: var(--fs-main-color); */
  /* border: 1px solid var(--fs-main-color); */
  /* filter: drop-shadow(0 0 3px var(--fs-outline-color)); */
}
</style>
