import { assert } from '../assert'
import { listGetAtIndex, listAllOneType, listLength, promoteConsToList, first, rest } from '../types/list'
import { booleanType, tokenType, functionType, macroType, consType as cons, numberType, TYPE } from '../types/types'

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

function mathFnRunner(params, reducer) {
    assert(listLength(params) >= 1, `Math functions require at least 1 parameter`)
    assert(listAllOneType(params, TYPE.number), `Math functions require all parameters to be numbers`)

    let value = first(params).value
    let numbers = rest(params)
    let ptr = numbers.head
    while (ptr.type !== TYPE.null) {
        value = reducer(value, ptr.value.value)
        ptr = ptr.next
    }

    return numberType(value)
}

export default [
    [tokenType('>'), functionType('(> num1 num2)', greaterThan)],
    [tokenType('>='), functionType('(>= num1 num2)', greaterThanOrEqualTo)],
    [tokenType('<'), functionType('(< num1 num2)', lessThan)],
    [tokenType('<='), functionType('(<= num1 num2)', lessThanOrEqualTo)],
    [tokenType('+'), functionType('(fn + ...numbers)', (params) => mathFnRunner(params, (a, b) => a + b))],
    [tokenType('-'), functionType('(fn - ...numbers)', (params) => mathFnRunner(params, (a, b) => a - b))],
    [tokenType('*'), functionType('(fn * ...numbers)', (params) => mathFnRunner(params, (a, b) => a * b))],
    [tokenType('/'), functionType('(fn / ...numbers)', (params) => mathFnRunner(params, (a, b) => a / b))],
    [
        tokenType('++1'),
        macroType('(macro ++1 arg)', (argsList) => {
            let plus = tokenType('+')
            let one = numberType(1)

            return promoteConsToList(cons(plus, cons(one, argsList.head)))
        }),
    ],
]
