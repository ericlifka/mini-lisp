import { assert } from '../assert'
import { TYPE, vectorType } from './types'

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

export function vectorPush(vector, item) {
    assert(vector.type === TYPE.vector, `TypeError: Push can only operate on vectors`)

    vector.value.push(item)
    return vector
}

export function vectorPop(vector) {
    assert(vector.type === TYPE.vector, `TypeError: Pop can only operate on vectors`)

    return vector.value.pop()
}

export function vectorMap(vector, fn) {
    assert(vector.type === TYPE.vector, `TypeError: map-vector can only operate on vectors`)

    return vectorType(vector.value.map((elem, i) => fn(elem, i)))
}

export function vectorFilter(vector, fn) {
    assert(vector.type === TYPE.vector, `TypeError: filter-vector can only operate on vectors`)

    return vectorType(
        vector.value.filter((elem, i) => {
            return fn(elem, i)
        })
    )
}
