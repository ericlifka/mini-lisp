import { listGetAtIndex, promoteConsToList } from '../types/list'
import { consType, functionType, hashmapType, nullType, tokenType, TYPE, vectorType } from '../types/types'
import { volatileHashmapSet } from '../types/hashmap'
import { vectorFromList } from '../types/vector'
import { arrayOfArguments } from '../destructuring'
import { assert } from '../assert'

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

        volatileHashmapSet(hashmap, key, value)
    }

    return hashmap
}

function emptyVectorForm(args) {
    let [length, fill] = arrayOfArguments(args, 2)
    assert(length.type === TYPE.number, `empty-vector: length param must be number`)
    let vector = vectorType()

    for (let i = 0; i < length.value; i++) {
        vector.value[i] = fill
    }

    return vector
}

export default [
    [tokenType('list'), functionType(`(list entity1 entity2 ...)`, (params) => params)],
    [tokenType('cons'), functionType(`(cons entity list|null|entity)`, consForm)],
    [tokenType('vector'), functionType(`(vector entity1 entity2...)`, (params) => vectorFromList(params))],
    [tokenType('hashmap'), functionType(`(hashmap key1 value1 ...)`, hashmapForm)],
    [tokenType('empty-vector'), functionType(`(empty-vector length fill?)`, emptyVectorForm)],
]
