# pohsun-vue-components

Vue3 components library
Using compotition api, TypeScript

> Created by **pohsun**
> email: pohsun4work@gmail.com

## Dialog

### 傳入參數

| 參數名稱      | 型別         | 說明                           | 預設值 |
| ------------- | ------------ | ------------------------------ | ------ |
| v-model       | ref<boolean> | 控制 dialog 的開關             |        |
| clickOutSide  | boolean      | 點擊 modal 是否可以關掉 dialog | true   |
| maxWidthScale | number       | dialog 最大寬度的縮放比例      | 0.8    |
| @closeFn      | function     | 關閉 dialog 時觸發的 function  |        |

## FormSchema

> 目前不支援 TypeScript(2024/05/20)

### 傳入參數

| 參數名稱     | 型別      | 說明       | 預設值    |
| ------------ | --------- | ---------- | --------- |
| schema       | ISchema[] | 表格設定值 |           |
| layout       | ILayout   | 排版       |           |
| mainColor    | string    | 主色       | '#3f8dff' |
| outlineColor | string    | 框線顏色   | '#000000' |
