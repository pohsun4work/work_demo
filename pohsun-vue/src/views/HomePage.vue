<script setup lang="ts">
import { RouterLink } from "vue-router";

// 展示頁面
const demoPages = [
  { title: "dialog", link: "/demo/dialog" },
  { title: "form schema", link: "/demo/formSchema" },
];
</script>

<template>
  <h1>功能展示</h1>
  <ul>
    <li v-for="page in demoPages">
      <RouterLink :to="page.link">{{ page.title }}</RouterLink>
    </li>
  </ul>
</template>
