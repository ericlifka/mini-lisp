import { assert } from '../assert'
import { listGetAtIndex } from '../types/list'
import { functionType, nullType, tokenType, TYPE } from '../types/types'
import { vectorFromList, vectorPush, vectorPop } from '../types/vector'

export function vectorGetForm(params) {
    let vector = listGetAtIndex(params, 0)
    let key = listGetAtIndex(params, 1)

    assert(vector.type === TYPE.vector && key.type === TYPE.number, `vector-get requires a vector followed by an index`)

    return vector.value[key.value] || nullType()
}

export default [
    [tokenType('vector'), functionType(`(vector entity1 entity2...)`, (params) => vectorFromList(params))],
    [
        tokenType('push'),
        functionType(`(push vector entity)`, (params) =>
            vectorPush(listGetAtIndex(params, 0), listGetAtIndex(params, 1))
        ),
    ],
    [tokenType('vector-get'), functionType('(vector-get vector key)', vectorGetForm)],
    [tokenType('pop'), functionType(`(pop vector)`, (params) => vectorPop(listGetAtIndex(params, 0)))],
]
