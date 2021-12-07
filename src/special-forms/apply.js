import { assert } from '../assert'
import { listGetAtIndex, listFromVector } from '../types/list'
import { functionType, tokenType, TYPE } from '../types/types'

function applyForm(params, scope) {
    let fn = listGetAtIndex(params, 0)
    let args = listGetAtIndex(params, 1)

    if (args.type === TYPE.vector) {
        args = listFromVector(args)
    }

    assert(
        fn.type === TYPE.function && args.type === TYPE.list,
        `TypeError: apply only accepts a function and a list as parameters`
    )

    return fn.execute(args)
}

export default [tokenType('apply'), functionType(`(apply fn list)`, applyForm)]
