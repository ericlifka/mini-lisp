import { assert } from '../assert'
import { arrayOfArguments } from '../destructuring'
import { hashmapSet } from '../types/hashmap'
import { cons, listGetAtIndex } from '../types/list'
import { functionType, tokenType, TYPE } from '../types/types'
import { vectorPush } from '../types/vector'

function pushForm(params) {
    let [iterable, value, value2] = arrayOfArguments(params, 2)

    switch (iterable.type) {
        case TYPE.list:
            return cons(value, iterable)

        case TYPE.vector:
            return vectorPush(iterable, value)

        case TYPE.hashmap:
            return hashmapSet(iterable, value, value2)

        default:
            assert(false, `TypeError: push doesn't support type ${iterable.type}`)
    }
}

export default [
    [tokenType('push'), functionType(`(push iterable entity)`, pushForm)],
    // need pattern matching for this form to work right
    // [tokenType('pop'), functionType(`(pop vector)`, (params) => vectorPop(listGetAtIndex(params, 0)))],
]
