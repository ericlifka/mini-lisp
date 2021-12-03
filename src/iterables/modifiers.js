import { assert } from '../assert'
import { listGetAtIndex } from '../types/list'
import { functionType, nullType, tokenType, TYPE } from '../types/types'
import { vectorFromList, vectorPush, vectorPop } from '../types/vector'

export default [
    [
        tokenType('push'),
        functionType(`(push vector entity)`, (params) =>
            vectorPush(listGetAtIndex(params, 0), listGetAtIndex(params, 1))
        ),
    ],
    [tokenType('pop'), functionType(`(pop vector)`, (params) => vectorPop(listGetAtIndex(params, 0)))],
]
