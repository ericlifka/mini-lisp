import { assert } from '../assert'
import { first, listForEach, listGetAtIndex, rest, toList } from '../types/list'
import { functionType, tokenType, TYPE } from '../types/types'

function runReduce(fn, list) {
    assert(list.type === TYPE.list, `Second parameter to reduce must be a list type`)

    let reduceVal = first(list)
    let others = rest(list)
    listForEach(others, (val, index) => {
        reduceVal = fn.execute(toList(reduceVal, val, index))
    })
    return reduceVal
}

function reduceFunctionForm(params, scope) {
    let fn = listGetAtIndex(params, 0)
    let list = listGetAtIndex(params, 1)

    assert(fn.type === TYPE.function, `First parameter to reduce must be a function`)
    if (list.type === TYPE.null) {
        return functionType(`(reduce list)`, (otherParams) => runReduce(fn, listGetAtIndex(otherParams, 0)))
    } else {
        return runReduce(fn, list)
    }
}

export default [tokenType('reduce'), functionType(`(reduce fn list)`, reduceFunctionForm)]
