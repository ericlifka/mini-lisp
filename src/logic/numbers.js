import { assert } from '../assert'
import { listGetAtIndex, listAllOneType, listLength, promoteConsToList, first, rest } from '../types/list'
import { booleanType, tokenType, functionType, macroType, consType as cons, numberType, TYPE } from '../types/types'

function mathComparison(params, comparitor) {
    let first = listGetAtIndex(params, 0)
    let second = listGetAtIndex(params, 1)
    assert(first.type === TYPE.number && second.type === TYPE.number, `Comparison functions require two numbers`)

    return booleanType(comparitor(first.value, second.value))
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
    [tokenType('>'), functionType('(> ...numbers)', (params) => mathComparison(params, (a, b) => a > b))],
    [tokenType('>='), functionType('(>= ...numbers)', (params) => mathComparison(params, (a, b) => a >= b))],
    [tokenType('<'), functionType('(< ...numbers)', (params) => mathComparison(params, (a, b) => a < b))],
    [tokenType('<='), functionType('(<= ...numbers)', (params) => mathComparison(params, (a, b) => a <= b))],
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
    [
        tokenType('sqrt'),
        functionType('(sqrt number)', (params) => {
            let number = listGetAtIndex(params, 0)
            assert(number.type === TYPE.number, `sqrt only works on numbers`)

            return numberType(Math.sqrt(number.value))
        }),
    ],
    [
        tokenType('%'),
        functionType('(% num1 num2)', (params) => {
            let first = listGetAtIndex(params, 0)
            let second = listGetAtIndex(params, 1)
            assert(first.type === TYPE.number && second.type === TYPE.number, `% requires two numbers`)

            return numberType(first.value % second.value)
        }),
    ],
]
