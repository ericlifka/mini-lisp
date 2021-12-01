import { assert } from '../assert'
import { printToString } from '../logger'
import { nullType, TYPE } from './types'

export function hashmapSet(hashmap, key, value) {
    assert(key.type !== TYPE.null, `Hashmap: null cannot be used as a key`)

    let stringified = printToString(key)

    if (!(stringified in hashmap.values)) {
        hashmap.keys.push(key)
    }
    hashmap.values[stringified] = value

    return hashmap
}

export function hashmapGet(hashmap, key) {
    assert(key.type !== TYPE.null, `Hashmap: null canot be used as a key`)
    let stringified = printToString(key)

    return hashmap.values[stringified] || nullType()
}
