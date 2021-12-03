import { listGetAtIndex } from '../types/list'
import { functionType, tokenType } from '../types/types'
import { vectorPush } from '../types/vector'

export default [
    [
        tokenType('push'),
        functionType(`(push vector entity)`, (params) =>
            vectorPush(listGetAtIndex(params, 0), listGetAtIndex(params, 1))
        ),
    ],
    // need pattern matching for this form to work right
    // [tokenType('pop'), functionType(`(pop vector)`, (params) => vectorPop(listGetAtIndex(params, 0)))],
]
