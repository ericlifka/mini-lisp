import { functionType, tokenType, numberType, TYPE } from '../types/types'
import { listFilter, listGetAtIndex, toList } from '../types/list'
import { vectorFilter } from '../types/vector'
import { assert } from '../assert'
import { isTruthy } from '../logic/booleans'

function runFilter(fn, iterable) {
    if (iterable.type === TYPE.list) {
        return listFilter(iterable, (val, index) => {
            return isTruthy(fn.execute(toList(val, numberType(index))))
        })
    } else if (iterable.type === TYPE.vector) {
        return vectorFilter(iterable, (val, index) => {
            return isTruthy(fn.execute(toList(val, numberType(index), iterable)))
        })
    }

    assert(false, `Second parameter to filter must be an iterable type`)
}

function filterFunction(params) {
    let fn = listGetAtIndex(params, 0)
    let list = listGetAtIndex(params, 1)

    assert(fn.type === TYPE.function, `First parameter to filter must be a function`)
    if (list.type === TYPE.null) {
        return functionType(`(filter list|vector)`, (otherParams) => runFilter(fn, listGetAtIndex(otherParams, 0)))
    } else {
        return runFilter(fn, list)
    }
}

export default [tokenType('filter'), functionType(`(filter fn list|vector)`, filterFunction)]
