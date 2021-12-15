import { assert } from '../assert'
import { arrayOfArguments } from '../destructuring'
import { hashmapSet } from '../types/hashmap'
import { cons, promoteConsToList } from '../types/list'
import { consType, functionType, tokenType, TYPE } from '../types/types'
import { vectorFromList, vectorPush } from '../types/vector'

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

function joinList(consChain1, consChain2) {
    if (consChain1.type === TYPE.null) {
        return consChain2
    }
    let first = consChain1.value
    let rest = consChain1.next

    return consType(first, joinList(rest, consChain2))
}

function concatForm(params) {
    let args = vectorFromList(params).value
    let last = args[args.length - 1]
    assert(last.type === TYPE.list, `concat only supports joining lists - ${last.type}`)

    let result = last.head
    for (let i = args.length - 2; i >= 0; i--) {
        assert(args[i].type === TYPE.list, `concat only supports joining lists - ${args[i].type}`)

        result = joinList(args[i].head, result)
    }

    return promoteConsToList(result)
}

export default [
    [tokenType('push'), functionType(`(push iterable entity)`, pushForm)],
    [tokenType('concat'), functionType(`(concat list1 ... list2)`, concatForm)],
    // need pattern matching for this form to work right
    // [tokenType('pop'), functionType(`(pop vector)`, (params) => vectorPop(listGetAtIndex(params, 0)))],
]
