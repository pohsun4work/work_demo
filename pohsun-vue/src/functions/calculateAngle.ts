export default (o: ICoordinate, a: ICoordinate, b: ICoordinate): number => {
  // 計算向量 oa 和 ob
  const oa = { x: a.x - o.x, y: a.y - o.y };
  const ob = { x: b.x - o.x, y: b.y - o.y };

  // 計算向量 oa 和 ob 的內積
  const dotProduct = oa.x * ob.x + oa.y * ob.y;
  // 計算向量 oa 和 ob 的長度
  const length_oa = Math.sqrt(oa.x * oa.x + oa.y * oa.y);
  const length_ob = Math.sqrt(ob.x * ob.x + ob.y * ob.y);

  // 計算弧度，並換成角度
  const angleInRadians = Math.acos(dotProduct / (length_oa * length_ob));
  const angleInDegrees = angleInRadians * (180 / Math.PI);

  // 計算向量 oa 和 ob 的叉積F
  // 大於等於0 => oa 在 ob 的順時針方向且角度小於等於180度
  const crossProduct = oa.x * ob.y - oa.y * ob.x;

  return crossProduct >= 0 ? angleInDegrees : 360 - angleInDegrees;
};

interface ICoordinate {
  x: number;
  y: number;
}
