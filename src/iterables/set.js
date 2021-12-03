import { listGetAtIndex, listSet } from '../types/list'
import { functionType, tokenType, TYPE } from '../types/types'
import { hashmapSet } from '../types/hashmap'
import { assert } from '../assert'
import { vectorSet } from '../types/vector'

function runSet(entity, key, value) {
    switch (entity.type) {
        case TYPE.list:
            return listSet(entity, key, value)

        case TYPE.vector:
            return vectorSet(entity, key, value)

        case TYPE.hashmap:
            return hashmapSet(entity, key, value)

        default:
            assert(false, `TypeError: first parameter to set must be an iterable type`)
    }
}

function setForm(params) {
    let iterable = listGetAtIndex(params, 0)
    let key = listGetAtIndex(params, 1)
    let value = listGetAtIndex(params, 2)

    if (key.type === TYPE.null) {
        return functionType(`(set key|index value)`, (params) => {
            let key = listGetAtIndex(params, 0)
            let value = listGetAtIndex(params, 1)

            return runSet(iterable, key, value)
        })
    } else {
        return runSet(iterable, key, value)
    }
}

export default [tokenType('set'), functionType('(set iterable key|index value)', setForm)]
