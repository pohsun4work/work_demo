<script setup>
import { ref, computed, watch } from 'vue'
import CollapseFunc from './CollapseFunc.vue'

const props = defineProps({
  schema: { type: Object, required: true }
})
const model = defineModel()
const emits = defineEmits(['checkRules'])

const collapseOpen = ref(false)
const collapseEL = ref(null)
const inputModel = ref('')
const inputEl = ref(null)
const inputBoxEl = ref(null)
const filterOptions = computed(() =>
  props.schema.options.filter(
    ({ value: v, label: l }) => l.includes(inputModel.value) && !model.value.includes(v)
  )
)

const focusInput = () => (collapseOpen.value = true)
const blurInput = (e) => {
  // blur觸發在ul裡面，視為沒有blur
  if (e && e.relatedTarget === collapseEL.value) return

  collapseOpen.value = false
}

const selectOption = (option) => {
  model.value = [...model.value, option.value]
  inputEl.value.focus()
}
const remeoveOption = (m) => (model.value = model.value.filter((v) => v !== m))

const focusOnInput = (e) => {
  if (e.target !== inputBoxEl.value) return

  inputEl.value.focus()
}

//初始化先判斷check.rules，避免每次model變更都需要判斷
const isCheckhasRules = ref(props.schema.check?.rules !== undefined)
watch(model, () => {
  if (!isCheckhasRules.value) return

  emits('checkRules', { type: 'change', target: { value: model.value } })
})
</script>

<template>
  <span>
    <span
      class="fs-component__inputFocusTarget fs-multi"
      ref="inputBoxEl"
      @click="(e) => focusOnInput(e)"
    >
      <span
        v-for="m in model"
        :key="m"
        class="fs-multi__selected"
        tabindex="-1"
        @click="() => remeoveOption(m)"
        >{{ props.schema.options.find(({ value: v }) => v == m).label }}</span
      >
      <input
        type="text"
        :id="props.schema.key"
        :placeholder="props.schema.placeholder"
        class="fs-component__input fs-component__input-multi fs-multi__input"
        ref="inputEl"
        v-model="inputModel"
        @focus="() => focusInput()"
        @blur="(e) => blurInput(e)"
      />
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
.fs-multi {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;

  padding: 7.5px;
  line-height: inherit;
  border-radius: 15px;
  border: 1px solid black;
  outline: none;
}

.fs-multi__selected {
  padding: 7px 5px 7px 15px;
  border-radius: 10px;
  background-color: var(--fs-main-color-a);
  cursor: pointer;
}

.fs-multi__selected::after {
  margin-left: 15px;
  content: '×';
  font-size: calc(var(--fs-fontSize) * 1);
}

.fs-multi__input {
  flex-grow: 1;
}
</style>
