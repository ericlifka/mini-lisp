import { assert } from '../assert'
import { listGetAtIndex, listMap, toList } from '../types/list'
import { functionType, tokenType, numberType, TYPE } from '../types/types'
import { vectorMap } from '../types/vector'
import { hashmapMap } from '../types/hashmap'

function runMap(fn, iterable) {
    let mapFn = (val, key) => fn.execute(toList(val, key, iterable))

    switch (iterable.type) {
        case TYPE.list:
            return listMap(iterable, mapFn)

        case TYPE.vector:
            return vectorMap(iterable, mapFn)

        case TYPE.hashmap:
            return hashmapMap(iterable, mapFn)

        default:
            assert(false, `Second parameter to map must be an iteratable type`)
    }
}

function mapFunctionForm(params) {
    let fn = listGetAtIndex(params, 0)
    let iterable = listGetAtIndex(params, 1)
    assert(fn.type === TYPE.function, `First parameter to map must be a function`)

    if (iterable.type === TYPE.null) {
        return functionType(`(map iterable)`, (params) => {
            let iterable = listGetAtIndex(params, 0)

            return runMap(fn, iterable)
        })
    } else {
        return runMap(fn, iterable)
    }
}

export default [tokenType('map'), functionType(`(map fn iterable)`, mapFunctionForm)]
