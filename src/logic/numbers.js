import { assert } from '../assert'
import { listGetAtIndex, listLength, listReduce, listForEach } from '../types/list'
import { booleanType, tokenType, functionType, numberType, TYPE } from '../types/types'

const compareNumbers = (fn) => (params) => {
    let first = listGetAtIndex(params, 0)
    let second = listGetAtIndex(params, 1)

    assert(
        listLength(params) === 2 && first.type === TYPE.number && second.type === TYPE.number,
        `Math functions require exactly two numbers`
    )

    return booleanType(fn(first.value, second.value))
}

const combineNumbers = (symbol, fn) => (params) => {
    return listReduce(params, (accum, elem) => {
        assert(
            accum.type === TYPE.number && elem.type === TYPE.number,
            `Math function ${symbol} only works with numbers`
        )

        return numberType(fn(accum.value, elem.value))
    })
}

export default [
    [
        tokenType('>'),
        functionType(
            '(> left right)',
            compareNumbers((a, b) => a > b)
        ),
    ],
    [
        tokenType('>='),
        functionType(
            '(>= left right)',
            compareNumbers((a, b) => a >= b)
        ),
    ],
    [
        tokenType('<'),
        functionType(
            '(< left right)',
            compareNumbers((a, b) => a < b)
        ),
    ],
    [
        tokenType('<='),
        functionType(
            '(<= left right)',
            compareNumbers((a, b) => a <= b)
        ),
    ],
    [
        tokenType('+'),
        functionType(
            '(+ ...numbers)',
            combineNumbers('+', (a, b) => a + b)
        ),
    ],
    [
        tokenType('-'),
        functionType(
            '(- ...numbers)',
            combineNumbers('-', (a, b) => a - b)
        ),
    ],
    [
        tokenType('*'),
        functionType(
            '(* ...numbers)',
            combineNumbers('*', (a, b) => a * b)
        ),
    ],
    [
        tokenType('/'),
        functionType(
            '(/ ...numbers)',
            combineNumbers('/', (a, b) => a / b)
        ),
    ],
    [
        tokenType('%'),
        functionType(
            '(% ...numbers)',
            combineNumbers('%', (a, b) => a % b)
        ),
    ],
    [
        tokenType('sqrt'),
        functionType('(sqrt number)', (params) => {
            let num = listGetAtIndex(params, 0)
            assert(num.type === TYPE.number, `sqrt only works on numbers`)

            return numberType(Math.sqrt(num.value))
        }),
    ],
]
