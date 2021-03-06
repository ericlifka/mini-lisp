import { assert } from './assert'
import { printToString } from './logger'
import { getGlobalScope, lookupOnScopeChain } from './scope'
import { listMap, promoteConsToList } from './types/list'
import { TYPE } from './types/types'

export function runCode(code, scope = getGlobalScope()) {
    assert(code && code.type, `Unrecognized entity error: can not evaluate entity ${code}`)

    switch (code.type) {
        case TYPE.string:
        case TYPE.number:
        case TYPE.boolean:
        case TYPE.null:
        case TYPE.vector:
        case TYPE.hashmap:
        case TYPE.cons:
        case TYPE.function:
        case TYPE.macro:
            return code

        case TYPE.token:
            return runToken(code, scope)

        case TYPE.list:
            return runList(code, scope)
    }

    assert(false, `Type error: unexpected type passed to eval: ${code.type}`)
}

function runToken(token, scope) {
    if (token.value[0] === ':') {
        return token
    } else {
        return lookupOnScopeChain(scope, token)
    }
}

function runList(list, scope) {
    let first = list.head.value
    let rest = promoteConsToList(list.head.next)

    let executor = runCode(first, scope)

    let run =
        executor.type === TYPE.specialForm
            ? runSpecialForm
            : executor.type === TYPE.function
            ? runFunction
            : executor.type === TYPE.macro
            ? runMacro
            : null

    assert(
        run,
        `Invalid Function error: list ${printToString(list)} cannot be executed because ${printToString(
            first
        )} is not a function, macro, or special form`
    )

    return run(executor, rest, scope)
}

function runSpecialForm(specialForm, argList, scope) {
    return specialForm.execute(argList, scope)
}

function runFunction(fn, argList, scope) {
    let params = listMap(argList, (entity) => runCode(entity, scope))

    return fn.execute(params, scope)
}

function runMacro(macro, argList, scope) {
    let expand = macro.execute(argList, scope)

    return runCode(expand, scope)
}
