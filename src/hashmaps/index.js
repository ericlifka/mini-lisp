import { listGetAtIndex, listLength } from '../types/list'
import { functionType, hashmapType, tokenType, TYPE } from '../types/types'
import { hashmapGet, hashmapSet } from '../types/hashmap'
import { assert } from '../assert'

function hashmapForm(params) {
    let hashmap = hashmapType()
    let length = listLength(params)

    for (let i = 0; i < length; i += 2) {
        let key = listGetAtIndex(params, i)
        let value = listGetAtIndex(params, i + 1)

        hashmapSet(hashmap, key, value)
    }

    return hashmap
}

export function hashmapGetForm(params) {
    let hashmap = listGetAtIndex(params, 0)
    let key = listGetAtIndex(params, 1)

    assert(hashmap.type === TYPE.hashmap, `hashmap-get first param must be a hashmap`)
    if (key.type === TYPE.null) {
        return functionType(`(bound-hashmap-get key)`, (params) => {
            return hashmapGet(hashmap, listGetAtIndex(params, 0))
        })
    } else {
        return hashmapGet(hashmap, key)
    }
}

function hashmapSetForm(params) {
    let hashmap = listGetAtIndex(params, 0)
    let key = listGetAtIndex(params, 1)
    let value = listGetAtIndex(params, 2)

    assert(hashmap.type === TYPE.hashmap, `hashmap-set first param must be a hashmap`)
    if (key.type === TYPE.null) {
        return functionType(`(bound-hashmap-set key value)`, (params) => {
            return hashmapSet(hashmap, listGetAtIndex(params, 0), listGetAtIndex(params, 1))
        })
    } else {
        return hashmapSet(hashmap, key, value)
    }
}

export default [
    [tokenType('hashmap'), functionType(`(hashmap key1 value1 ...)`, hashmapForm)],
    [tokenType('hashmap-get'), functionType(`(hashmap-get hashmap key)`, hashmapGetForm)],
    [tokenType('hashmap-set'), functionType('(hashmap-set hashmap key value)', hashmapSetForm)],
]
