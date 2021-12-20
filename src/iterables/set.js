import { listGetAtIndex, listSet } from '../types/list'
import { functionType, tokenType, TYPE } from '../types/types'
import { hashmapSet, volatileHashmapSet } from '../types/hashmap'
import { assert } from '../assert'
import { vectorSet, volatileVectorSet } from '../types/vector'
import { arrayOfArguments } from '../destructuring'

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

function setVolatileForm(args) {
    let [iterable, key, value] = arrayOfArguments(args, 3)

    if (iterable.type === TYPE.vector) {
        return volatileVectorSet(iterable, key, value)
    } else if (iterable.type === TYPE.hashmap) {
        return volatileHashmapSet(iterable, key, value)
    } else {
        assert(false, `set-volatile only works for vectors and hashmaps, not ${iterable.type}`)
    }

    return iterable
}

export default [
    [tokenType('set'), functionType('(set iterable key|index value)', setForm)],
    [tokenType('set-volatile'), functionType(`(set-volatile iterable key|index value)`, setVolatileForm)],
    [tokenType('set*'), functionType(`(set-volatile iterable key|index value)`, setVolatileForm)],
]
