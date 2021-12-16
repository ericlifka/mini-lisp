import { assert } from '../assert'
import { nullType, numberType, TYPE, vectorType } from './types'

export function vectorFromList(list) {
    let vector = vectorType()
    if (list.type === TYPE.null) {
        return vector
    }

    let ptr = list.head
    while (ptr.type !== TYPE.null) {
        vector.value.push(ptr.value)
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
    assert(vector.value >= 0, `TypeError: index for vector must be positive number`)

    let newVector = vectorType([...vector.value])

    return volatileVectorSet(newVector, index, value)
}

export function volatileVectorSet(vector, index, value) {
    assert(vector.type === TYPE.vector && index.type === TYPE.number, `TypeError: Set expects a vector and an index`)
    assert(vector.value >= 0, `TypeError: index for vector must be positive number`)

    for (let i = vector.value.length; i < index.value; i++) {
        vector.value[i] = nullType()
    }
    vector.value[index.value] = value
    return vector
}

export function vectorPush(vector, item) {
    assert(vector.type === TYPE.vector, `TypeError: Push can only operate on a vector`)

    return vectorType([item, ...vector.value])
}

// can't implement this properly until I have destructuring for getting both values at once
// export function vectorPop(vector) {
//     assert(vector.type === TYPE.vector, `TypeError: Pop can only operate on a vector`)

//     return vector.value.pop()
// }

export function vectorFirst(vector) {
    assert(vector.type === TYPE.vector, `TypeError: First can only operate on a vetor`)

    return vector.value[0] || nullType()
}

export function vectorRest(vector) {
    assert(vector.type === TYPE.vector, `TypeError: Rest can only operate on a vector`)
    return vectorType(vector.value.slice(1))
}

export function vectorForEach(vector, fn) {
    assert(vector.type === TYPE.vector, `TypeError: foreach-vector can only operate on vectors`)

    vector.value.forEach((elem, i) => fn(elem, numberType(i)))

    return nullType()
}

export function vectorMap(vector, fn) {
    assert(vector.type === TYPE.vector, `TypeError: map-vector can only operate on vectors`)

    return vectorType(
        vector.value.map((elem, i) => {
            return fn(elem, numberType(i))
        })
    )
}

export function vectorFilter(vector, fn) {
    assert(vector.type === TYPE.vector, `TypeError: filter-vector can only operate on vectors`)

    return vectorType(
        vector.value.filter((elem, i) => {
            return fn(elem, numberType(i))
        })
    )
}

export function vectorFind(vector, fn) {
    assert(vector.type === TYPE.vector, `TypeError: find-vector can only operate on vectors`)

    for (let i = 0; i < vector.value.length; i++) {
        if (fn(vector.value[i], numberType(i))) {
            return vector.value[i]
        }
    }
}

export function vectorReduce(start, vector, firstProvided, fn) {
    let accumulator = start
    let i = firstProvided ? 0 : 1

    vectorForEach(vector, (elem) => {
        accumulator = fn(accumulator, elem, numberType(i++))
    })

    return accumulator
}

export function vectorSort(vector, sorter) {
    assert(vector.type === TYPE.vector, `TypeError: sort-vector can only operate on vectors`)

    let newVector = vectorType([...vector.value])
    newVector.value.sort(sorter)

    return newVector
}
