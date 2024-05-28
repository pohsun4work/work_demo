/** 旋鈕 */
export interface IKnob {
  /** 最小值 */
  minValue?: number;
  /** 最大值 */
  maxValue?: number;

  /** 起點位置 */
  startPosition?: Angle;

  /** 內層顏色 */
  innerColor?: string;
  /** 外層顏色 */
  outerColor?: string;

  /** 內層尺寸(直徑) */
  innerSize?: string;
  /** 外層尺寸(直徑) */
  outerSize?: string;

  // /** 內層 */
  // inner?: LayerStyle;
  // /** 外層 */
  // outer?: LayerStyle;
}

/** 角度(0~359) */
type Angle = number;

// export interface LayerStyle {
//   color?: string;
//   size?: string;
// }
