<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { IKnob } from "./type.ts";
import { registerEvent } from "@/use";
import { calculateAngle } from "@/functions";

const props = withDefaults(defineProps<IKnob>(), {
  minValue: 0,
  maxValue: 100,
  startPosition: 0,
  innerColor: "#FFFFFF",
  outerColor: "#009688",
  innerSize: "80px",
  outerSize: "100px",
});
const model = defineModel<number>({ default: 0 });
const emits = defineEmits(["whileMax"]);
const knob = ref<HTMLElement>();

// 開始角度
const startAngle = computed<string>(() => {
  // svg起始位置是右邊
  const offsetInit = -90;
  return `${offsetInit + props.startPosition}deg`;
});
// 外圍尺寸
const size = computed<number>(() => knob.value?.offsetWidth ?? 0);

let isMouseDown: boolean = false;
const handleMouseDown = () => (isMouseDown = true);
const handleMouseUp = () => (isMouseDown = false);
const mainHandler = (event: Event) => {
  if (!isMouseDown) return;
  const e = event as MouseEvent;

  // 座標(e.offsetY, e.offsetX)算出百分比(或角度?)
  // startPosition也要考慮
  const center = { x: size.value / 2, y: size.value / 2 };
  const start = { x: size.value / 2, y: 0 };
  const target = { x: e.offsetX, y: e.offsetY };

  const angle = calculateAngle(center, start, target);

  let percentage = (angle - props.startPosition) / 360;
  if (percentage < 0) percentage = 1 + percentage;

  const newModel =
    Math.ceil((props.maxValue - props.minValue) * percentage) + props.minValue;

  if (newModel === props.maxValue) emits("whileMax");

  return (model.value = newModel);
};

onMounted(() => {
  model.value =
    model.value < (props.minValue ?? 0) ? props.minValue ?? 0 : model.value;

  const events: { e: keyof HTMLElementEventMap; fn: EventListener }[] = [
    { e: "mousedown", fn: handleMouseDown },
    { e: "mouseup", fn: handleMouseUp },
    { e: "mousemove", fn: mainHandler },
  ];

  const listeners = events.map(({ e, fn }) =>
    registerEvent(knob.value!, e, fn)
  );
  onUnmounted(() => listeners.forEach((tmp) => tmp()));
});
</script>

<template>
  <div class="knob" :style="{ width: outerSize, height: outerSize }">
    <svg
      :width="size"
      :height="size"
      xmlns="http://www.w3.org/2000/svg"
      class="knob__svg"
    >
      <circle
        :r="size / 4"
        :cx="size / 2"
        :cy="size / 2"
        fill="transparent"
        :stroke="outerColor"
        :stroke-width="size / 2"
        :stroke-dasharray="(size / 2) * Math.PI"
        :stroke-dashoffset="(size / 2) * Math.PI * (1 - (model!- minValue) / (maxValue - minValue))"
      />
    </svg>
    <div class="knob_text">{{ model }}</div>
    <div ref="knob" class="knob__div" style="width: 100%; height: 100%"></div>
  </div>
</template>

<style scoped>
.knob {
  display: grid;
  place-items: center;
}

.knob > * {
  grid-area: 1 / 1 / 2 / 2;
}

.knob__svg {
  transform: rotateZ(v-bind(startAngle));
}

.knob__div {
  z-index: 2;
}

.knob_text {
  width: v-bind(innerSize);
  aspect-ratio: 1 / 1;
  line-height: v-bind(innerSize);
  text-align: center;
  background: v-bind(innerColor);
  border-radius: 50%;
  z-index: 1;
  user-select: none;
}
</style>
