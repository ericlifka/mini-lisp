import { assert } from '../assert'
import { hashmapGet, hashmapFirst } from '../types/hashmap'
import { vectorFirst, vectorGet, vectorRest } from '../types/vector'
import { listGetAtIndex, listLength, promoteConsToList } from '../types/list'
import { functionType, listType, nullType, numberType, tokenType, TYPE } from '../types/types'

function runGet(entity, key) {
    switch (entity.type) {
        case TYPE.list:
            assert(key.type === TYPE.number, `TypeError: index must be a number`)
            return listGetAtIndex(entity, key.value)

        case TYPE.vector:
            return vectorGet(entity, key)

        case TYPE.hashmap:
            return hashmapGet(entity, key)

        default:
            assert(false, `TypeError: first parameter to get must be an iterable type`)
    }
}

function getForm(params) {
    let entity = listGetAtIndex(params, 0)
    let key = listGetAtIndex(params, 1)

    if (key.type === TYPE.null) {
        return functionType(`(get key|index)`, (params) => runGet(entity, listGetAtIndex(params, 0)))
    } else {
        return runGet(entity, key)
    }
}

export function firstForm(params) {
    let param = listGetAtIndex(params, 0)
    if (param.type === TYPE.list) {
        return listGetAtIndex(param, 0)
    } else if (param.type === TYPE.cons) {
        return param.value
    } else if (param.type === TYPE.null) {
        return nullType()
    } else if (param.type === TYPE.vector) {
        return vectorFirst(param)
    } else if (param.type === TYPE.hashmap) {
        return hashmapFirst(param)
    }

    assert(false, `(first) requires an iterable entity`)
}

export function restForm(params) {
    let param = listGetAtIndex(params, 0)
    if (param.type === TYPE.list) {
        if (param.head.type === TYPE.null) {
            return listType()
        }
        return promoteConsToList(param.head.next)
    } else if (param.type === TYPE.cons) {
        return param.next
    } else if (param.type === TYPE.null) {
        return listType()
    } else if (param.type === TYPE.vector) {
        return vectorRest(param)
    }

    assert(false, `(rest) requires a list or list like entity`)
}

function lengthForm(params) {
    let param = listGetAtIndex(params, 0)
    if (param.type === TYPE.list) {
        return numberType(listLength(param))
    } else if (param.type === TYPE.null) {
        return numberType(0)
    } else if (param.type === TYPE.vector) {
        return numberType(param.value.length)
    } else if (param.type === TYPE.hashmap) {
        return numberType(param.keys.length)
    }

    assert(false, `(length) only works on iterables`)
}

export default [
    [tokenType('get'), functionType(`(get iterable key)`, getForm)],
    [tokenType('first'), functionType(`(first list|vector)`, firstForm)],
    [tokenType('rest'), functionType(`(rest list|vector)`, restForm)],
    [tokenType('length'), functionType(`(length iterable)`, lengthForm)],
]
