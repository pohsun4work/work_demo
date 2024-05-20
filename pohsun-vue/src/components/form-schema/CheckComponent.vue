<script setup>
import { computed } from 'vue'

const props = defineProps({
  schema: { type: Object, required: true }
})
const model = defineModel()
const emits = defineEmits(['checkRules'])

const isDisabled = computed(() =>
  props.schema.options.map((v) => {
    if (!Array.isArray(model.value)) return false

    const rule = props.schema.check?.rules?.find(
      ({ rule }) => 'max' in rule || 'exact' in rule
    )?.rule
    if (!rule) return false

    return (
      (model.value.length >= rule.exact || model.value.length >= rule.max) &&
      !model.value.includes(v.value)
    )
  })
)
</script>

<template>
  <span class="fs-check">
    <span
      v-for="(option, l) in props.schema.options"
      :key="`${props.schema.key}_${l}`"
      class="fs-checkItem"
    >
      <input
        :type="props.schema.type"
        :id="`${props.schema.key}_${l}`"
        :name="props.schema.name"
        :value="option.value"
        v-model="model"
        :disabled="isDisabled[l]"
        class="fs-component__input fs-component__inputFocusTarget fs-checkItem__input"
        @blur="(e) => emits('checkRules', { type: e.type, target: { value: model } })"
        @change="(e) => emits('checkRules', { type: e.type, target: { value: model } })"
      />
      <label :for="`${props.schema.key}_${l}`">{{ option.label }}</label>
    </span>
  </span>
</template>

<style scoped>
.fs-check {
  --fs-check-size: calc(var(--fs-size) * 0.7);

  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.fs-checkItem {
  display: flex;
  align-items: center;
}

.fs-checkItem__input {
  width: var(--fs-check-size);
  height: var(--fs-check-size);
}
</style>
