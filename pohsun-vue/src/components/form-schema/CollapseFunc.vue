<script setup>
import { ref, computed, watchEffect } from 'vue'

const props = defineProps({
  open: { type: Boolean, required: true },
  maxHeight: { type: String },
  minHeight: { type: String }
})

const maxHeight = computed(() => props.maxHeight ?? '')
const minHeight = computed(() => props.minHeight ?? '')
const collapse_class = ref('')

watchEffect(() => {
  if (!props.open) {
    collapse_class.value = ''
    return
  }

  collapse_class.value = 'collapse--open'
  setTimeout(() => (collapse_class.value = 'collapse--open collapse--opened'), 300)
})
</script>

<template>
  <div class="collapse__container" :class="collapse_class">
    <slot></slot>
  </div>
</template>

<style scoped>
.collapse__container {
  max-height: v-bind(maxHeight);
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s linear;
  overflow-y: hidden;
}

.collapse__container:deep(> *) {
  overflow-y: scroll;
  margin: 0;
}

.collapse--open {
  grid-template-rows: 1fr;
}

.collapse--opened {
  min-height: v-bind(minHeight);
}
</style>
