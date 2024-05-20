<script setup>
import { ref, shallowRef, computed, onMounted } from 'vue'
import './formschema.css'
import './formschema.select.css'
import TitleLabel from './TitleLabel.vue'
import CheckComponent from './CheckComponent.vue'
import SelectComponent from './SelectComponent.vue'
import MultiSelectComponent from './MultiSelectComponent.vue'
import SwitchComponent from './SwitchComponent.vue'
import InputComponent from './InputComponent.vue'
const components = {
  radio: CheckComponent,
  checkbox: CheckComponent,
  select: SelectComponent,
  'multi-select': MultiSelectComponent,
  switch: SwitchComponent,
  default: InputComponent
}
//基本輸出為陣列，switch為第二個選項，其他皆為undefined
const typeIsMulti = ['checkbox', 'multi-select']

const props = defineProps({
  schema: { type: Array, required: true },
  layout: { type: Object },
  mainColor: { type: String },
  outlineColor: { type: String }
})
const emits = defineEmits(['output', 'handleRequiredEmpty', 'handleInputWrong'])

const _schema = shallowRef([])
const inputValue = ref({})

onMounted(() => {
  //_schema生成key, component
  //inputValue設定預設值
  props.schema.map(({ type, name: n, default: d, ...rest }) => {
    const key = n.split('').reduce((accu, curr) => (accu += curr.charCodeAt(0).toString(36)), '')

    const component = components[type] ?? components['default']

    const isMulti = typeIsMulti.includes(type)

    _schema.value = [..._schema.value, { type, name: n, default: d, ...rest, key, component }]
    inputValue.value = { ...inputValue.value, [n]: d ?? (isMulti ? [] : undefined) }
  })
})

//#region ----- 規則判斷/輸出 -----
const inputWrong = ref({})

const checkRules = (action, schemaItem) => {
  const { type: aType, target } = action
  const { name: n, check } = schemaItem
  if (check === undefined) return

  for (const rule of check?.rules ?? []) {
    //event type不同，跳過判斷
    if (rule.on !== aType) continue

    const warning =
      typeof rule.warning === 'function' ? rule.warning : () => (inputWrong.value[n] = rule.warning)

    //符合字串(input會把數字變成字串，所以用!=)
    if (typeof rule.rule === 'string' && rule.rule != target.value) {
      warning()
      break
    }

    //正規表達
    if (rule.rule instanceof RegExp && !rule.rule.test(target.value)) {
      warning()
      break
    }

    //複選數量(剛好、上限、下限)
    if (
      ('exact' in rule.rule && target.value.length !== rule.rule.exact) ||
      ('max' in rule.rule && target.value.length > rule.rule.max) ||
      ('min' in rule.rule && target.value.length < rule.rule.min)
    ) {
      warning()
      break
    }

    //符合其他欄位
    if ('same' in rule.rule && target.value !== inputValue.value[rule.rule.same]) {
      warning()
      break
    }

    inputWrong.value[n] = undefined
  }
}

const outputFunc = () => {
  let outputTmp = inputValue.value

  for (const { name: n, type: t, default_output: dop, check: c } of _schema.value) {
    const { [n]: item, ...rest } = outputTmp
    const isItemEmpty = item === undefined || (typeIsMulti.includes(t) && item.length === 0)

    //判斷必填項目是否填寫
    if (c?.required && isItemEmpty) {
      emits('handleRequiredEmpty')
      return
    }

    //判斷項目符合check
    if (Object.values(inputWrong.value).some((v) => v !== undefined)) {
      emits('handleInputWrong')
      return
    }

    //空值使用預設輸入
    if (isItemEmpty && dop !== undefined) {
      outputTmp = { ...rest, [n]: dop }
    }
  }

  emits('output', outputTmp)
}
//#endregion

//#region ----- 樣式 -----
const formBoxStyle = computed(() => {
  let tmp = {}

  if (props.mainColor)
    tmp = {
      ...tmp,
      '--fs-main-color': props.mainColor,
      '--fs-main-color-a': `${props.mainColor}66`
    }
  if (props.outlineColor) tmp = { ...tmp, '--fs-outline-color': props.outlineColor }
  if (props.layout?.gap) tmp = { ...tmp, '--fs-gap': props.layout.gap }

  return tmp
})

const layout = computed(() => {
  const ad = props.layout?.direction?.toLowerCase()

  return _schema.value.reduce((accu, { name: n, layout }) => {
    let tmp = {}

    if ((layout?.direction?.toLowerCase() ?? ad ?? 'x') === 'y')
      tmp = { ...tmp, gridTemplateColumns: '1fr' }
    if (layout?.gridArea) tmp = { ...tmp, gridArea: layout.gridArea }
    if (layout?.titleGap) tmp = { ...tmp, gap: layout.titleGap }

    accu = { ...accu, [n]: tmp }
    return accu
  }, {})
})
//#endregion
</script>

<template>
  <div class="fs-main" :style="formBoxStyle">
    <template v-for="item in _schema">
      <div
        :key="item.key"
        v-if="item.show ?? true"
        class="fs-components"
        :style="layout[item.name]"
        :data-content="inputWrong[item.name]"
      >
        <TitleLabel :schema="item" class="fs-components__title" />
        <component
          :is="item.component"
          :schema="item"
          v-model="inputValue[item.name]"
          @checkRules="(e) => checkRules(e, item)"
        />
      </div>
    </template>
    <div class="fs-outputBtn">
      <span @click="outputFunc">
        <slot name="outputButton">
          <button class="fs-outputBtn__sampleBtn"><slot>確定</slot></button>
        </slot>
      </span>
      <slot name="other"></slot>
    </div>
  </div>
</template>
