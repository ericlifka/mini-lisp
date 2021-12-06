import { assert } from '../assert'
import { printToString } from '../logger'
import { isTruthy } from '../logic/booleans'
import { hashmapType, nullType, TYPE } from './types'

// WARNING: only use on a new hashmap being built, never a datastructure from userspace
export function volatileHashmapSet(hashmap, key, value) {
    assert(key.type !== TYPE.null, `Hashmap: null cannot be used as a key`)

    let stringified = printToString(key)

    if (!(stringified in hashmap.values)) {
        hashmap.keys.push(key)
    }
    hashmap.values[stringified] = value

    return hashmap
}

export function hashmapSet(hashmap, key, value) {
    assert(hashmap.type === TYPE.hashmap, `TypeError: set can only operate on hashmaps`)
    assert(key.type !== TYPE.null, `Hashmap: null canot be used as a key`)

    let newHashmap = hashmapType()
    hashmap.keys.forEach((k) => {
        volatileHashmapSet(newHashmap, k, hashmapGet(hashmap, k))
    })

    volatileHashmapSet(newHashmap, key, value)

    return newHashmap
}

export function hashmapGet(hashmap, key) {
    assert(key.type !== TYPE.null, `Hashmap: null canot be used as a key`)
    let stringified = printToString(key)

    return hashmap.values[stringified] || nullType()
}

export function hashmapFirst(hashmap) {
    assert(hashmap.type === TYPE.hashmap, `TypeError: First can only operate on hashmaps`)

    let key = hashmap.keys[0]
    if (!key) {
        return nullType()
    }

    return hashmapGet(hashmap, key)
}

export function hashmapRest(hashmap) {
    assert(hashmap.type === TYPE.hashmap, `TypeError: map-hashmap can only operate on hashmaps`)

    let newHashmap = hashmapType()
    hashmap.keys.slice(1).forEach((key) => {
        volatileHashmapSet(newHashmap, key, hashmapGet(hashmap, key))
    })

    return newHashmap
}

export function hashmapForEach(hashmap, fn) {
    assert(hashmap.type === TYPE.hashmap, `TypeError: foreach-hashmap can only operate on hashmaps`)

    hashmap.keys.forEach((key) => {
        fn(hashmapGet(hashmap, key), key)
    })

    return nullType()
}

export function hashmapMap(hashmap, fn) {
    assert(hashmap.type === TYPE.hashmap, `TypeError: map-hashmap can only operate on hashmaps`)

    let newHashmap = hashmapType()
    hashmap.keys.forEach((key) => {
        volatileHashmapSet(newHashmap, key, fn(hashmapGet(hashmap, key), key))
    })

    return newHashmap
}

export function hashmapFilter(hashmap, fn) {
    assert(hashmap.type === TYPE.hashmap, `TypeError: filter-hashmap can only operate on hashmaps`)

    let newHashmap = hashmapType()
    hashmap.keys.forEach((key) => {
        let val = hashmapGet(hashmap, key)
        if (fn(val, key)) {
            volatileHashmapSet(newHashmap, key, val)
        }
    })

    return newHashmap
}

export function hashmapReduce(start, hashmap, firstProvided, fn) {
    let accumulator = start

    hashmapForEach(hashmap, (val, key) => {
        accumulator = fn(accumulator, val, key)
    })

    return accumulator
}

export function hashmapSort(hashmap, sorter) {
    assert(hashmap.type === TYPE.hashmap, `TypeError: sort-hashmap can only operate on hashmaps`)

    let newHashmap = hashmapMap(hashmap, (entity) => entity)

    newHashmap.keys.sort((key1, key2) => {
        return sorter(hashmapGet(newHashmap, key1), hashmapGet(newHashmap, key2), key1, key2)
    })

    return newHashmap
}
