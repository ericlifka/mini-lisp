import { assert } from '../assert'
import { listGetAtIndex, mapList, toList } from '../types/list'
import { functionType, tokenType, TYPE } from '../types/types'

function runMap(fn, list) {
    assert(list.type === TYPE.list, `Second parameter to map must be a list type`)

    return mapList(list, (val, index) => {
        return fn.execute(toList(val, index))
    })
}

function mapFunctionForm(params) {
    let fn = listGetAtIndex(params, 0)
    let list = listGetAtIndex(params, 1)

    assert(fn.type === TYPE.function, `First parameter to map must be a function`)
    if (list.type === TYPE.null) {
        return functionType(`(map list)`, (otherParams) => runMap(fn, listGetAtIndex(otherParams, 0)))
    } else {
        return runMap(fn, list)
    }
}

export default [tokenType('map'), functionType(`(map fn)|(map fn list)`, mapFunctionForm)]
