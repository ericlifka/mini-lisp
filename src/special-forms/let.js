import { assert } from '../assert'
import { matchParameter } from '../destructuring'
import { runCode } from '../eval'
import { createScope, setOnScope } from '../scope'
import { listGetAtIndex, listLength } from '../types/list'
import { tokenType, specialFormType, nullType, TYPE } from '../types/types'

export function letForm(argList, scope) {
    let result = nullType()

    if (listLength(argList) === 0) {
        return result
    }

    let tokens = argList.head.value
    let body = argList.head.next
    assert(
        tokens.type === TYPE.list,
        `Malformed code error: First argument to let must be a list of token and value pairs`
    )

    let tokenCount = listLength(tokens)
    let letScope = createScope([], scope)

    for (let index = 0; index < tokenCount; index += 2) {
        let lval = listGetAtIndex(tokens, index)
        let rval = runCode(listGetAtIndex(tokens, index + 1), letScope)
        let assignedValues = matchParameter(lval, rval)

        assignedValues.forEach(([token, value]) => {
            setOnScope(letScope, token, value)
        })
    }

    while (body.type !== TYPE.null) {
        result = runCode(body.value, letScope)

        body = body.next
    }

    return result
}

export default [tokenType('let'), specialFormType('<let special form>', letForm)]
