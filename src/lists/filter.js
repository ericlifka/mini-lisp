import { functionType, tokenType, TYPE } from '../types/types'
import { listFilter, listGetAtIndex, toList } from '../types/list'
import { assert } from '../assert'
import { isTruthy } from '../logic/booleans'

function runFilter(fn, list) {
    assert(list.type === TYPE.list, `Second parameter to filter must be a list type`)

    return listFilter(list, (val, index) => {
        return isTruthy(fn.execute(toList(val, index)))
    })
}

function filterFunction(params) {
    let fn = listGetAtIndex(params, 0)
    let list = listGetAtIndex(params, 1)

    assert(fn.type === TYPE.function, `First parameter to filter must be a function`)
    if (list.type === TYPE.null) {
        return functionType(`(filter list)`, (otherParams) => runFilter(fn, listGetAtIndex(otherParams, 0)))
    } else {
        return runFilter(fn, list)
    }
}

export default [tokenType('filter'), functionType(`(filter fn list)`, filterFunction)]
