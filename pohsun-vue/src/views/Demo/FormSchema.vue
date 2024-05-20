<script setup lang="ts">
import { phFormSchema } from "@/components";

const schema = [
  {
    type: "select",
    name: "field1",
    title: "autocomplete下拉",
    placeholder: "請輸入並選擇",
    // default: 'a',
    options: [
      { label: "選項一", value: "a" },
      { label: "選項二", value: "b" },
      { label: "選項三", value: "c" },
      { label: "選項四", value: "d" },
    ],
  },
  {
    type: "switch",
    name: "field2",
    title: "切換開關",
    // default: true,
    options: [true, false],
  },
  {
    type: "checkbox",
    name: "field3",
    title: "勾選",
    default: ["a", "b"],
    options: [
      { label: "選項一", value: "a" },
      { label: "選項二", value: "b" },
      { label: "選項三", value: "c" },
      { label: "選項四", value: "d" },
    ],
    check: {
      rules: [
        {
          on: "change",
          rule: { exact: 2 },
          warning: "數量不符",
        },
      ],
    },
  },
  {
    type: "radio",
    name: "field4",
    title: "單選",
    // default: "c",
    options: [
      { label: "選項一", value: "a" },
      { label: "選項二", value: "b" },
      { label: "選項三", value: "c" },
    ],
    check: { required: true },
  },
  {
    type: "multi-select",
    name: "field5",
    title: "多選下拉",
    placeholder: "請輸入搜尋字",
    default: ["a", "a1", "b"],
    options: [
      { label: "選項一", value: "a" },
      { label: "選項一之一", value: "a1" },
      { label: "選項二", value: "b" },
      { label: "選項三", value: "c" },
      { label: "選項三之一", value: "c1" },
      { label: "選項三之二", value: "c2" },
      { label: "選項四", value: "d" },
      { label: "選項五", value: "e" },
      { label: "選項六", value: "f" },
      { label: "選項七", value: "g" },
    ],
    check: {
      required: true,
      rules: [
        {
          on: "change",
          rule: { min: 3 },
          warning: "太少了",
        },
        {
          on: "change",
          rule: { max: 5 },
          warning: "多了!! 多了!!",
        },
      ],
    },
  },
  {
    type: "number",
    name: "field6",
    title: "數字",
    placeholder: "二的倍數",
    default_output: 0,
    min: 2,
    max: 98,
    step: 2,
  },
  {
    type: "password",
    name: "pwd",
    title: "密碼",
    placeholder: "請輸入密碼",
    check: {
      rules: [
        {
          on: "blur",
          rule: /\w{6,20}/,
          warning: "密碼格式不符",
        },
      ],
    },
  },
  {
    type: "password",
    name: "pwd_2",
    title: "密碼確認",
    placeholder: "請再次輸入密碼",
    check: {
      rules: [
        {
          on: "blur",
          rule: { same: "pwd" },
          warning: "密碼不相符",
        },
      ],
    },
  },
];
</script>

<template>
  <phFormSchema
    :schema="schema"
    :main-color="'#c1430d'"
    @output="(data) => console.log(data)"
    @handleRequiredEmpty="() => console.log('有必填未填')"
    @handleInputWrong="() => console.log('有不符合規則')"
  />
</template>
