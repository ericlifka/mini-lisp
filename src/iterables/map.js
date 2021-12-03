import { assert } from '../assert'
import { listGetAtIndex, listMap, toList } from '../types/list'
import { functionType, tokenType, numberType, TYPE } from '../types/types'
import { vectorMap } from '../types/vector'
import { hashmapMap } from '../types/hashmap'

function runMap(fn, iterable) {
    let mapper = (val, key) => fn.execute(toList(val, key, iterable))

    if (iterable.type === TYPE.list) {
        return listMap(iterable, mapper)
    } else if (iterable.type === TYPE.vector) {
        return vectorMap(iterable, mapper)
    } else if (iterable.type === TYPE.hashmap) {
        return hashmapMap(iterable, mapper)
    }

    assert(false, `Second parameter to map must be an iteratable type`)
}

function mapFunctionForm(params) {
    let fn = listGetAtIndex(params, 0)
    let list = listGetAtIndex(params, 1)
    assert(fn.type === TYPE.function, `First parameter to map must be a function`)

    if (list.type === TYPE.null) {
        return functionType(`(map iterable)`, (otherParams) => runMap(fn, listGetAtIndex(otherParams, 0)))
    } else {
        return runMap(fn, list)
    }
}

export default [tokenType('map'), functionType(`(map fn iterable)`, mapFunctionForm)]
