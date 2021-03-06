import { assert } from '../assert'
import { printToString } from '../logger'
import { listGetAtIndex, listLength, listReduce, listForEach, listFirst, listRest } from '../types/list'
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
    let first = listFirst(params)
    let rest = listRest(params)

    return listReduce(first, rest, true, (accum, elem) => {
        assert(
            accum.type === TYPE.number && elem.type === TYPE.number,
            `Math function ${symbol} only works with numbers, got ${accum.type} and ${elem.type}\n${printToString(
                accum
            )}\n${printToString(elem)}`
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
        tokenType('is-even'),
        functionType(`(is-even number)`, (args) => {
            let num = listGetAtIndex(args, 0)
            assert(num.type === TYPE.number, `is-even only works on numbers`)

            return booleanType(num.value % 2 === 0)
        }),
    ],
    [
        tokenType('is-odd'),
        functionType(`(is-odd number)`, (args) => {
            let num = listGetAtIndex(args, 0)
            assert(num.type === TYPE.number, `is-odd only works on numbers`)

            return booleanType(num.value % 2 !== 0)
        }),
    ],
    [
        tokenType('sqrt'),
        functionType('(sqrt number)', (params) => {
            let num = listGetAtIndex(params, 0)
            assert(num.type === TYPE.number, `sqrt only works on numbers`)

            return numberType(Math.sqrt(num.value))
        }),
    ],
    [
        tokenType('ceil'),
        functionType(`(ceil number)`, (params) => {
            let num = listGetAtIndex(params, 0)
            assert(num.type === TYPE.number, `ceil only works on numbers`)

            return numberType(Math.ceil(num.value))
        }),
    ],
    [
        tokenType('floor'),
        functionType(`(floor number)`, (params) => {
            let num = listGetAtIndex(params, 0)
            assert(num.type === TYPE.number, `floor only works on numbers`)

            return numberType(Math.floor(num.value))
        }),
    ],
    [
        tokenType('abs'),
        functionType(`(abs number)`, (params) => {
            let num = listGetAtIndex(params, 0)
            assert(num.type === TYPE.number, `abs only works on numbers`)

            return numberType(Math.abs(num.value))
        }),
    ],
    [
        tokenType('round'),
        functionType(`(round number)`, (params) => {
            let num = listGetAtIndex(params, 0)
            assert(num.type === TYPE.number, `round only works on numbers`)

            return numberType(Math.round(num.value))
        }),
    ],
]
