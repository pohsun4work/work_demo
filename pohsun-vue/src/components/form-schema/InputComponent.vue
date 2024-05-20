<script setup>
const props = defineProps({
  schema: { type: Object, required: true }
})
const model = defineModel()
const emits = defineEmits(['checkRules'])
</script>

<template>
  <span>
    <input
      :type="props.schema.type"
      :id="props.schema.key"
      :placeholder="props.schema.placeholder"
      v-model="model"
      :max="props.schema.max"
      :min="props.schema.min"
      :step="props.schema.step"
      class="fs-component__input fs-component__inputFocusTarget"
      @input="(e) => emits('checkRules', e)"
      @blur="(e) => emits('checkRules', e)"
    />
  </span>
</template>

<style scoped></style>
