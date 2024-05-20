<script setup>
import { ref } from 'vue'

const props = defineProps({
  schema: { type: Object, required: true }
})

const required = ref(props.schema.check?.required ?? false)
</script>

<template>
  <span
    v-if="['radio', 'checkbox', 'switch'].includes(props.schema.type)"
    :class="{ requiredIcon: required }"
    >{{ props.schema.title }}</span
  >
  <label v-else :for="props.schema.key" :class="{ requiredIcon: required }">{{
    props.schema.title
  }}</label>
</template>

<style scoped>
.requiredIcon::before {
  content: '*';
  color: red;
}
</style>
