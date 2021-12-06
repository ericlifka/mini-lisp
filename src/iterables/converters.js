import { assert } from '../assert'
import { listFromVector, listGetAtIndex } from '../types/list'
import { functionType, tokenType, TYPE } from '../types/types'
import { vectorFromList } from '../types/vector'

function listFromVectorForm(params) {
    let vector = listGetAtIndex(params, 0)
    assert(vector.type === TYPE.vector, `TypeError: list-from-vector requires a vector`)

    return listFromVector(vector)
}

function vectorFromListForm(params) {
    let list = listGetAtIndex(params, 0)
    assert(list.type === TYPE.list, `TypeError: vector-from-list requires a list`)

    return vectorFromList(list)
}

export default [
    [tokenType('list-from-vector'), functionType(`(list-from-vector vector)`, listFromVectorForm)],
    [tokenType('vector-from-list'), functionType(`(vector-from-list list)`, vectorFromListForm)],
]
