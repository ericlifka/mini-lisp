import { assert } from '../assert'
import { arrayOfArguments } from '../destructuring'
import { printToString } from '../logger'
import { listGetAtIndex, toList } from '../types/list'
import { functionType, numberType, stringType, tokenType, TYPE, vectorType } from '../types/types'
import { vectorFromList } from '../types/vector'

function padTo(str, width, char) {
    while (str.length < width) {
        str = char + str
    }
    return str
}

function vectorPrint(vector, padding, formatter) {
    return (
        '[' +
        vector.value
            .map((entity) => {
                if (formatter && formatter.type === TYPE.function) {
                    entity = formatter.execute(toList(entity))
                }
                return padTo(entity.value + '', padding, ' ')
            })
            .join(' ') +
        ']'
    )
}

function matrixPrintForm(params) {
    let matrix = listGetAtIndex(params, 0)
    let padding = listGetAtIndex(params, 1)
    let formatter = listGetAtIndex(params, 2)

    padding = padding.type === TYPE.number ? padding.value : 0

    let matrixStrs = matrix.value.map((vector) => vectorPrint(vector, padding, formatter))
    return stringType('[' + matrixStrs.join('\n ') + ']\n')
}

function matrixCreateForm(params) {
    let width = listGetAtIndex(params, 0)
    let height = listGetAtIndex(params, 1)
    let defaultValueFn = listGetAtIndex(params, 2)

    if (defaultValueFn.type === TYPE.null && height.type === TYPE.function) {
        defaultValueFn = height
        height = numberType(1)
    }

    if (height.type === TYPE.null) {
        height = numberType(1)
    }

    if (defaultValueFn.type !== TYPE.function) {
        let zero = numberType(0)
        defaultValueFn = functionType(`(zero)`, () => zero)
    }

    assert(
        width.type === TYPE.number && height.type === TYPE.number && defaultValueFn.type === TYPE.function,
        `matrix-create must have a width, height, and default value supplier function`
    )

    let matrix = vectorType()
    for (let h = 0; h < height.value; h++) {
        let vector = vectorType()
        matrix.value.push(vector)

        for (let w = 0; w < width.value; w++) {
            vector.value.push(defaultValueFn.execute(toList(numberType(w), numberType(h))))
        }
    }

    return matrix
}

function matrixReduceForm(params) {
    let fn = listGetAtIndex(params, 0)
    let accum = listGetAtIndex(params, 1)
    let matrix = listGetAtIndex(params, 2)

    assert(
        fn.type === TYPE.function,
        `TypeError: matrix-reduce expected function but got ${fn.type}:${printToString(fn)}`
    )
    assert(
        matrix.type === TYPE.vector,
        `TypeError: matrix-reduce expected matrix but got ${matrix.type}:${printToString(matrix)}`
    )

    for (let y = 0; y < matrix.value.length; y++) {
        let vector = matrix.value[y]

        for (let x = 0; x < vector.value.length; x++) {
            accum = fn.execute(toList(accum, vector.value[x], numberType(x), numberType(y)))
        }
    }

    return accum
}

function matrixGetForm(params) {
    let [matrix, x, y] = arrayOfArguments(params, 3)

    const runGet = (matrix, x, y) => {
        assert(
            matrix.type === TYPE.vector && x.type === TYPE.number && y.type === TYPE.number,
            `TypeError: matrix-get expects matrix number number for params`
        )
        assert(
            y.value >= 0 && y.value < matrix.value.length,
            `Error: matrix-get y out of bounds ${y.value}:${matrix.value.length}`
        )
        let vector = matrix.value[y.value]
        assert(
            x.value >= 0 && x.value < vector.value.length,
            `Error: matrix-get x out of bounds ${x.value}:${vector.value.length}`
        )

        return vector.value[x.value]
    }

    if (x.type === TYPE.null) {
        return functionType(`(bound-matrix-get x y)`, (params) => {
            let [x, y] = arrayOfArguments(params, 2)

            return runGet(matrix, x, y)
        })
    } else {
        return runGet(matrix, x, y)
    }
}

function matrixSetVolatileForm(params) {
    let [matrix, x, y, value] = arrayOfArguments(params, 4)

    assert(matrix.type === TYPE.vector, `TypeError: matrix-set-volatile matrix must be a vector`)
    assert(x.type === TYPE.number, `TypeError: matrix-set-volatile x must be a number`)
    assert(y.type === TYPE.number, `TypeError: matrix-set-volatile y must be a number`)

    let arr = matrix.value
    y = y.value
    x = x.value
    assert(y >= 0 && y < arr.length, `TypeError: matrix-set-volatile y out of matrix bounds ${y}:${arr.length}`)
    let vec = arr[y].value
    assert(x >= 0 && x < vec.length, `TypeError: matrix-set-volatile x out of matrix bounds ${x}:${vec.length}`)

    vec[x] = value
    return matrix
}

function matrixHeightForm(params) {
    let matrix = listGetAtIndex(params, 0)
    assert(matrix.type === TYPE.vector, `TypeError: matrix-height requires a matrix`)

    return numberType(matrix.value.length)
}

function matrixWidthForm(params) {
    let matrix = listGetAtIndex(params, 0)
    assert(
        matrix.type === TYPE.vector && matrix.value[0].type === TYPE.vector,
        `TypeError: matrix-height requires a matrix`
    )

    return numberType(matrix.value[0].value.length)
}

export default [
    [tokenType('matrix-print'), functionType(`(matrix-print matrix)`, matrixPrintForm)],
    [tokenType('matrix-create'), functionType(`(matrix-create width height? valueSetterFn?)`, matrixCreateForm)],
    [tokenType('matrix-get'), functionType(`(matrix-get matrix x y)`, matrixGetForm)],
    [tokenType('matrix-height'), functionType(`(matrix-width matrix)`, matrixHeightForm)],
    [tokenType('matrix-width'), functionType(`(matrix-width matrix)`, matrixWidthForm)],
    [tokenType('matrix-set-volatile'), functionType(`(matrix-set-volatile matrix x y value)`, matrixSetVolatileForm)],
    [
        tokenType('matrix-reduce'),
        functionType(`(matrix-reduce (fn (accum val x y) accum) accum matrix))`, matrixReduceForm),
    ],
]
