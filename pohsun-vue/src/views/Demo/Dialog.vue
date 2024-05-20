<script setup lang="ts">
import { ref } from "vue";
import { phDialog } from "@/components";

// dialog的開關
const isDialogOpen = ref<boolean>(false);

// 打開dialog
const dialogOpen = () => (isDialogOpen.value = true);

// 關閉dialog時觸發
const whileDialogClose = () => {
  alert("關閉dialog");
};
</script>

<template>
  <input type="button" value="dialog開關" @click="dialogOpen" />
  <phDialog v-model="isDialogOpen" @closeFn="whileDialogClose">
    <div>這是一個dialog</div>
  </phDialog>
</template>
