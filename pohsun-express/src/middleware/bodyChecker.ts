/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express'
import type { Simplify } from '@/type.js'

type FieldType = 'boolean' | 'number' | 'string' | 'array' | 'null' | 'undefined' | FieldTypes

type FieldTypes = {
  [key: string]: FieldType | FieldType[]
}

/**
 * middleware，用於檢查req.body的型別
 * @param { FieldTypes} fieldTypes 欄位的指定型別
 * - 型別: 'boolean' | 'number' | 'string' | 'array' | 'null' | 'undefined'
 * - 指定多型別，使用陣列
 * - 接受巢狀結構
 * @example bodyChecker({
 *   field1: 'number',
 *   field2: ['string', 'undefined'],
 *   field3: { field3_1: 'array' }
 * })
 */
export const bodyChecker =
  (fieldTypes: Simplify<FieldTypes>) => (req: Request, res: Response, next: NextFunction) => {
    const result = isStructureMatched(fieldTypes, req.body)

    if (Object.keys(result).length > 0) return res.status(400).send(JSON.stringify(result))

    next()
  }

/**
 * 檢查內容是否符合指定型別
 * @param { FieldType | FieldType[] } expectedType 指定型別
 * @param { any } value 需檢查內容
 * @returns { boolean } 布林值，內容是否符合指定型別
 */
function isMatchType(expectedType: FieldType | FieldType[], value: any): boolean {
  // 多個指定型別，遞迴自己
  if (Array.isArray(expectedType)) {
    return expectedType.some((type) => isMatchType(type, value))
  }

  // 指定型別是巢狀結構
  if (typeof expectedType === 'object') {
    if (typeof value !== 'object' || value === null) return false

    const nestedErrors = isStructureMatched(expectedType, value)
    return Object.keys(nestedErrors).length === 0
  }

  // 一般判斷
  switch (expectedType) {
    case 'array':
      return Array.isArray(value)
    case 'null':
      return value === null
    default:
      return typeof value === expectedType
  }
}

/**
 * 檢查資料是否符合格式及指定型別
 * @param { FieldTypes } format 資料格式及指定型別
 * @param { any } data 需檢查資料
 * @returns 全部符合 ? 空物件 : { 不符合項目的格式及指定型別 }
 */
function isStructureMatched(format: FieldTypes, data: any): FieldTypes {
  let errors = {}

  for (const key in format) {
    const expectedType = format[key]
    const value = data[key]

    // expectedType是巢狀結構
    if (
      typeof expectedType === 'object' &&
      expectedType !== null &&
      !Array.isArray(expectedType) &&
      // 確定value不是undefined或null，避免進巢狀爆掉
      value !== undefined &&
      value !== null
    ) {
      const nestedErrors = isStructureMatched(expectedType, value)
      if (Object.keys(nestedErrors).length > 0) {
        errors = { ...errors, [key]: nestedErrors }
      }
      continue
    }

    // 一般判斷
    if (!isMatchType(expectedType, value)) {
      errors = { ...errors, [key]: expectedType }
    }
  }

  return errors
}
