import { assert } from '../assert'
import { findDeclaredInScope, setOnScope, isLanguageScope } from '../scope'
import { listGetAtIndex, listLength } from '../types/list'
import { nullType, specialFormType, tokenType } from '../types/types'
import { runCode } from '../eval'

export function updateForm(argList, scope) {
    let argCount = listLength(argList)
    let result = nullType()

    for (let index = 0; index < argCount; index += 2) {
        let symbol = listGetAtIndex(argList, index)
        let expr = listGetAtIndex(argList, index + 1)

        let declaredInScope = findDeclaredInScope(scope, symbol)
        assert(!!declaredInScope, `Error: symbol ${symbol.value} not declared anywhere in scope`)
        assert(!isLanguageScope(scope), `Error: update cannot overwrite language level tokens`)

        result = runCode(expr, scope)
        setOnScope(declaredInScope, symbol, result)
    }

    return result
}

export default [tokenType('update'), specialFormType('(update token value)', updateForm)]
