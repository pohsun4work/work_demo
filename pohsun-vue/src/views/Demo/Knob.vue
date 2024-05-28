<script setup lang="ts">
import { ref } from "vue";
import { phKnob } from "@/components";

const knobValue = ref<number>(30);
</script>

<template>
  <phKnob
    v-model="knobValue"
    :min-value="50"
    :max-value="150"
    :inner-color="'#D6F896'"
    :outer-color="'#000000'"
    :outer-size="'150px'"
    :inner-size="'100px'"
    :start-position="45"
  />
</template>
