import { assert } from '../assert'
import { findDeclaredInScope, setOnScope } from '../scope'
import { listGetAtIndex, listLength } from '../types/list'
import { nullType, specialFormType, tokenType } from '../types/types'
import { runCode } from '../eval'

export function updateForm(argList, scope) {
    let argCount = listLength(argList)

    for (let index = 0; index < argCount; index += 2) {
        let symbol = listGetAtIndex(argList, index)
        let expr = listGetAtIndex(argList, index + 1)

        let declaredInScope = findDeclaredInScope(scope, symbol)
        assert(!!declaredInScope, `Error: symbol ${symbol.value} not declared anywhere in scope`)

        setOnScope(declaredInScope, symbol, runCode(expr, scope))
    }

    return nullType()
}

export default [tokenType('update'), specialFormType('<update special form>', updateForm)]
