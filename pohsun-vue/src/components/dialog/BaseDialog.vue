<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{ clickOutSide?: boolean; maxWidthScale?: number }>(),
  {
    /** 點擊modal是否可以關掉dialog */
    clickOutSide: true,
    /** dialog最大寬度的縮放比例 */
    maxWidthScale: 0.8,
  }
);
/** 控制dialog開關 */
const model = defineModel<boolean>();
const emit = defineEmits<{
  /** 關閉dialog同時觸發的function */
  closeFn: [];
}>();

const dialog = ref<HTMLDialogElement>();

// 點modal關掉dialog
const clickOutSideToClose = ({
  clientX: x,
  clientY: y,
}: {
  clientX: number;
  clientY: number;
}) => {
  if (!props.clickOutSide || !model.value) return;

  const { left, right, top, bottom } = dialog.value!.getBoundingClientRect();
  if (x < left || x > right || y < top || y > bottom) model.value = false;
};

watch(model, () => {
  if (!dialog.value) return;

  if (model.value) return dialog.value.showModal();

  dialog.value.close();
  emit("closeFn");
});
</script>

<template>
  <dialog ref="dialog" class="dialog" @click="clickOutSideToClose">
    <div class="dialog__closeMark_box">
      <span class="dialog__closeMark_mark" @click="() => (model = false)"
        >&#215;</span
      >
    </div>
    <slot></slot>
  </dialog>
</template>

<style scoped>
.dialog {
  padding: 0.5rem;
  padding-top: unset;
  width: max-content;
  max-width: calc(100% * v-bind(maxWidthScale));
  min-height: 40vh;
  outline: none;
  border-radius: 10px;
}

.dialog::backdrop {
  background: #0000004d;
}

.dialog__closeMark_box {
  display: flex;
}

.dialog__closeMark_mark {
  margin-left: auto;
  padding: unset 0.25rem;
  font-weight: bold;
  cursor: pointer;
}
</style>
