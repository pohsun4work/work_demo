/**
 * get element's offset position
 * @param { HTMLElement } el - the element
 * @returns { { x: number, y: number } } x: left, y: top
 */
export default (el: HTMLElement): { x: number; y: number } => {
  let x = 0;
  let y = 0;
  let el_tmp: HTMLElement | null = el;

  while (el_tmp !== null && el_tmp.tagName !== "HTML") {
    x += el_tmp.offsetLeft || 0;
    y += el_tmp.offsetTop || 0;
    el_tmp = el_tmp.offsetParent as HTMLElement;
  }

  return { x, y };
};
