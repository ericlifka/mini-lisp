import { assert } from '../assert'
import { printToString } from '../logger'
import { listGetAtIndex, toList } from '../types/list'
import { functionType, numberType, stringType, tokenType, TYPE, vectorType } from '../types/types'

function padTo(str, width, char) {
    while (str.length < width) {
        str = char + str
    }
    return str
}

function vectorPrint(vector, padding) {
    return '[' + vector.value.map((entity) => padTo(printToString(entity), padding, ' ')).join(' ') + ']'
}

function matrixPrintForm(params) {
    let matrix = listGetAtIndex(params, 0)
    let padding = listGetAtIndex(params, 1)
    padding = padding.type === TYPE.number ? padding.value : 0

    let matrixStrs = matrix.value.map((vector) => vectorPrint(vector, padding))
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

    console.log(width, height)

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

export default [
    [tokenType('matrix-print'), functionType(`(matrix-print matrix)`, matrixPrintForm)],
    [tokenType('matrix-create'), functionType(`(matrix-create width height? valueSetterFn?)`, matrixCreateForm)],
]
