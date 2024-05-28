interface IOptions extends AddEventListenerOptions {
  /** 秒數內事件觸發只執行一次callback */
  lazy?: number
}

/** window listener */
function registerEvent(
  action: keyof WindowEventMap,
  callback: EventListener,
  options?: IOptions
): () => void

/** element listener */
function registerEvent(
  target: HTMLElement,
  action: keyof HTMLElementEventMap,
  callback: EventListener,
  options?: IOptions
): () => void

function registerEvent(...arg: any[]): () => void {
  // 參數設定
  let target: EventTarget
  let action: string
  let callback: EventListener
  let options: IOptions
  if (typeof arg[2] === 'function') {
    ;[target, action, callback, options] = arg
  } else {
    target = window
    ;[action, callback, options] = arg
  }

  // options設定
  let listenerOptions: AddEventListenerOptions | undefined
  let lazy: number | undefined
  if (options !== undefined) ({ lazy, ...listenerOptions } = options)

  let timeoutId: number | null = null
  const handler: EventListener = (e: Event) => {
    if (lazy !== undefined) {
      if (timeoutId !== null) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => callback(e), lazy * 1000)
    } else {
      callback(e)
    }
  }

  target.addEventListener(action, handler, listenerOptions)
  return () => target.removeEventListener(action, handler)
}

export { registerEvent }
