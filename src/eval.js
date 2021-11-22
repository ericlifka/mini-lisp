import { assert } from "./assert";
import { printToString } from "./logger";
import { getGlobalScope, lookupOnScopeChain } from "./scope";
import { mapList, promoteConsToList } from "./types/list";
import { TYPE } from "./types/types";

export function runCode(code, scope = getGlobalScope()) {
    assert(code && code.type, `Unrecognized entity error: can not evaluate entity ${code}`)

    switch (code.type) {
        case TYPE.string:
        case TYPE.number:
        case TYPE.null:
        case TYPE.cons:
        case TYPE.function:
        case TYPE.macro:
            return code

        case TYPE.token:
            return lookupOnScopeChain(code, scope)

        case TYPE.list:
            return runList(code, scope)

    }

    assert(false, `Type error: unexpected type passed to eval: ${code.type}`)
}

function runList(list, scope) {
    let first = list.head.value
    let rest = promoteConsToList(list.head.next)

    let executor = runCode(first, scope)

    if (executor.type === TYPE.function) {
        let argList = mapList(rest, entity => 
            runCode(entity, scope))

        return executor.execute(argList)
    }
    // else if (executor.type === TYPE.macro) {

    // }
    
    assert(false, `Invalid Function error: list ${
        printToString(list)} cannot be executed because ${
        printToString(first)} is not a function or macro`)
}