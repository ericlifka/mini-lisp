import { assert } from '../assert'
import { listGetAtIndex, listMap, toList } from '../types/list'
import { functionType, tokenType, numberType, TYPE } from '../types/types'
import { vectorMap } from '../types/vector'

function runMap(fn, list) {
    let mapper = (val, index) => fn.execute(toList(val, numberType(index), list))

    if (list.type === TYPE.list) {
        return listMap(list, mapper)
    } else if (list.type === TYPE.vector) {
        return vectorMap(list, mapper)
    }

    assert(false, `Second parameter to map must be an iteratable type`)
}

function mapFunctionForm(params) {
    let fn = listGetAtIndex(params, 0)
    let list = listGetAtIndex(params, 1)

    assert(fn.type === TYPE.function, `First parameter to map must be a function`)
    if (list.type === TYPE.null) {
        return functionType(`(map list|vector)`, (otherParams) => runMap(fn, listGetAtIndex(otherParams, 0)))
    } else {
        return runMap(fn, list)
    }
}

export default [tokenType('map'), functionType(`(map fn)|(map fn list|vector)`, mapFunctionForm)]
