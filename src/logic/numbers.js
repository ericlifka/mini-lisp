import { assert } from '../assert'
import { listGetAtIndex, listLength } from '../types/list'
import { booleanType as boolean, tokenType as token, functionType, numberType as number, TYPE } from '../types/types'

const twoParamMath = (resultType, fn) => (params) => {
    let first = listGetAtIndex(params, 0)
    let second = listGetAtIndex(params, 1)
    assert(
        listLength(params) === 2 && first.type === TYPE.number && second.type === TYPE.number,
        `Math functions require exactly two numbers`
    )

    return resultType(fn(first.value, second.value))
}

export default [
    [
        token('>'),
        functionType(
            '(> ...numbers)',
            twoParamMath(boolean, (a, b) => a > b)
        ),
    ],
    [
        token('>='),
        functionType(
            '(>= ...numbers)',
            twoParamMath(boolean, (a, b) => a >= b)
        ),
    ],
    [
        token('<'),
        functionType(
            '(< ...numbers)',
            twoParamMath(boolean, (a, b) => a < b)
        ),
    ],
    [
        token('<='),
        functionType(
            '(<= ...numbers)',
            twoParamMath(boolean, (a, b) => a <= b)
        ),
    ],
    [
        token('+'),
        functionType(
            '(fn + ...numbers)',
            twoParamMath(number, (a, b) => a + b)
        ),
    ],
    [
        token('-'),
        functionType(
            '(fn - ...numbers)',
            twoParamMath(number, (a, b) => a - b)
        ),
    ],
    [
        token('*'),
        functionType(
            '(fn * ...numbers)',
            twoParamMath(number, (a, b) => a * b)
        ),
    ],
    [
        token('/'),
        functionType(
            '(fn / ...numbers)',
            twoParamMath(number, (a, b) => a / b)
        ),
    ],
    [
        token('%'),
        functionType(
            '(% num1 num2)',
            twoParamMath(number, (a, b) => a % b)
        ),
    ],
    [
        token('sqrt'),
        functionType('(sqrt number)', (params) => {
            let num = listGetAtIndex(params, 0)
            assert(num.type === TYPE.number, `sqrt only works on numbers`)

            return number(Math.sqrt(num.value))
        }),
    ],
]
