import { assert } from '../assert'
import { lookupOnScope, setOnScope } from '../scope'
import { listGetAtIndex, listLength } from '../types/list'
import { nullType, specialFormType, tokenType } from '../types/types'
import { runCode } from '../eval'

export function setForm(argList, scope) {
    let argCount = listLength(argList)
    let result = nullType()

    for (let index = 0; index < argCount; index += 2) {
        let symbol = listGetAtIndex(argList, index)
        let expr = listGetAtIndex(argList, index + 1)
        assert(!lookupOnScope(scope, symbol), `Error: symbol ${symbol.value} already declared at this scope`)

        result = runCode(expr, scope)
        setOnScope(scope, symbol, result)
    }

    return result
}

export default [tokenType('set'), specialFormType('<set special form>', setForm)]
