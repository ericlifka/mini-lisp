import { assert } from "../assert";
import { listGetAtIndex, listLength, listAllOneType } from "../types/list";
import { booleanType, functionType, tokenType, TYPE } from "../types/types";

export function validateParams(paramList, str) {
    assert(listLength(paramList) === 2, `${str} takes exactly 2 arguments`)
    assert(listAllOneType(paramList, TYPE.number), `${str} only accepts number arguments`)
}

export function greaterThan(paramList) {
    validateParams(paramList, '>')
    
    let first = listGetAtIndex(paramList, 0)
    let second = listGetAtIndex(paramList, 1)

    return booleanType(first.value > second.value)
}

export function greaterThanOrEqualTo(paramList) {
    validateParams(paramList, '>=')
    
    let first = listGetAtIndex(paramList, 0)
    let second = listGetAtIndex(paramList, 1)

    return booleanType(first.value >= second.value)
}

export function lessThan(paramList) {
    validateParams(paramList, '<')
    
    let first = listGetAtIndex(paramList, 0)
    let second = listGetAtIndex(paramList, 1)

    return booleanType(first.value < second.value)
}

export function lessThanOrEqualTo(paramList) {
    validateParams(paramList, '<=')
    
    let first = listGetAtIndex(paramList, 0)
    let second = listGetAtIndex(paramList, 1)

    return booleanType(first.value <= second.value)
}

export default [
    [tokenType('>'), functionType('(> num1 num2)', greaterThan)],
    [tokenType('>='), functionType('(>= num1 num2)', greaterThanOrEqualTo)],
    [tokenType('<'), functionType('(< num1 num2)', lessThan)],
    [tokenType('<='), functionType('(<= num1 num2)', lessThanOrEqualTo)],
]
