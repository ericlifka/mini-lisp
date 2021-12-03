import { assert } from '../assert'
import { nullType, numberType, TYPE, vectorType } from './types'

export function vectorFromList(list) {
    let vector = vectorType()
    if (list.type === TYPE.null) {
        return vector
    }

    let ptr = list.head
    while (ptr.type !== TYPE.null) {
        vectorPush(vector, ptr.value)
        ptr = ptr.next
    }

    return vector
}

export function vectorGet(vector, index) {
    assert(vector.type === TYPE.vector && index.type === TYPE.number, `TypeError: Get expects a vector and an index`)
    return vector.value[index.value] || nullType()
}

export function vectorSet(vector, index, value) {
    assert(vector.type === TYPE.vector && index.type === TYPE.number, `TypeError: Set expects a vector and an index`)
    vector.value[index.value] = value
    return vector
}

export function vectorPush(vector, item) {
    assert(vector.type === TYPE.vector, `TypeError: Push can only operate on a vector`)

    vector.value.push(item)
    return vector
}

export function vectorPop(vector) {
    assert(vector.type === TYPE.vector, `TypeError: Pop can only operate on a vector`)

    return vector.value.pop()
}

export function vectorRest(vector) {
    assert(vector.type === TYPE.vector, `TypeError: Rest can only operate on a vector`)
    return vectorType(vector.value.slice(1))
}

export function vectorMap(vector, fn) {
    assert(vector.type === TYPE.vector, `TypeError: map-vector can only operate on vectors`)

    return vectorType(vector.value.map((elem, i) => fn(elem, numberType(i))))
}

export function vectorFilter(vector, fn) {
    assert(vector.type === TYPE.vector, `TypeError: filter-vector can only operate on vectors`)

    return vectorType(
        vector.value.filter((elem, i) => {
            return fn(elem, i)
        })
    )
}
