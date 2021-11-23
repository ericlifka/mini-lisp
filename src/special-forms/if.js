import { assert } from "../assert";
import { runCode } from "../eval";
import { listGetAtIndex, listLength } from "../types/list";
import { specialFormType, tokenType, TYPE } from "../types/types";

export function ifSpecialForm(argsList, scope) {
    assert(listLength(argsList) === 3,
        `Argument error: If from must be provided 3 parameters: (if bool-check true-path false-path)`)

    let boolCheck = listGetAtIndex(argsList, 0)
    let truePath = listGetAtIndex(argsList, 1)
    let falsePath = listGetAtIndex(argsList, 2)

    let bool = runCode(boolCheck, scope)
    return ( bool.type === TYPE.boolean && bool.value === false )
          || bool.type === TYPE.null
                ? runCode(falsePath, scope)
                : runCode(truePath, scope) 
}

export default [tokenType('if'), specialFormType('<if special form>', ifSpecialForm)]
