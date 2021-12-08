import { assert } from '../assert'
import { listForEach, listGetAtIndex, listMap, toList } from '../types/list'
import { functionType, tokenType, numberType, TYPE } from '../types/types'
import { vectorForEach, vectorMap } from '../types/vector'
import { hashmapForEach, hashmapMap } from '../types/hashmap'

function runForeach(fn, iterable) {
    let foreachFn = (val, key) => fn.execute(toList(val, key, iterable))

    switch (iterable.type) {
        case TYPE.list:
            return listForEach(iterable, foreachFn)

        case TYPE.vector:
            return vectorForEach(iterable, foreachFn)

        case TYPE.hashmap:
            return hashmapForEach(iterable, foreachFn)

        default:
            assert(false, `Second parameter to map must be an iteratable type`)
    }
}

function foreachFunctionForm(params) {
    let fn = listGetAtIndex(params, 0)
    let iterable = listGetAtIndex(params, 1)
    assert(fn.type === TYPE.function, `First parameter to foreach must be a function`)

    if (iterable.type === TYPE.null) {
        return functionType(`(foreach iterable)`, (params) => {
            let iterable = listGetAtIndex(params, 0)

            return runForeach(fn, iterable)
        })
    } else {
        return runForeach(fn, iterable)
    }
}

export default [tokenType('foreach'), functionType(`(foreach fn iterable)`, foreachFunctionForm)]
