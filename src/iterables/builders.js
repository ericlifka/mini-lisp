import { listGetAtIndex, listLength } from '../types/list'
import { functionType, hashmapType, nullType, tokenType, TYPE } from '../types/types'
import { hashmapGet, hashmapSet } from '../types/hashmap'
import { assert } from '../assert'
import { vectorFromList } from '../types/vector'

function consForm(params) {
    let first = listGetAtIndex(params, 0)
    let second = listGetAtIndex(params, 1)

    if (second.type === TYPE.list) {
        return promoteConsToList(consType(first, second.head))
    } else if (second.type === TYPE.null) {
        return promoteConsToList(consType(first))
    } else {
        return consType(first, second)
    }
}

function hashmapForm(params) {
    let paramVector = vectorFromList(params)
    let length = paramVector.value.length
    let hashmap = hashmapType()

    for (let i = 0; i < length; i += 2) {
        let key = paramVector.value[i]
        let value = paramVector.value[i + 1] || nullType()

        hashmapSet(hashmap, key, value)
    }

    return hashmap
}

export default [
    [tokenType('list'), functionType(`(list entity1 entity2 ...)`, (params) => params)],
    [tokenType('cons'), functionType(`(cons entity list|null|entity)`, consForm)],
    [tokenType('vector'), functionType(`(vector entity1 entity2...)`, (params) => vectorFromList(params))],
    [tokenType('hashmap'), functionType(`(hashmap key1 value1 ...)`, hashmapForm)],
]
