/** 把一層一層的type拆開 */
export type Simplify<T> = T extends Record<string, unknown> ? { [K in keyof T]: Simplify<T[K]> } : T
/** 選擇到的屬性改為partial */
export type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
