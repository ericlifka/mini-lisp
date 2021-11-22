import { TYPE } from "./types/types"
import { assert } from "./assert"
import { builtIns } from "./built-ins"

export const getGlobalScope = () => __GLOBAL_SCOPE__

export function newScope(declaredSymbols, parent = getGlobalScope()) {
    let scope = {
        parent,
        tokens: { }
    }

    declaredSymbols.forEach(([symbol, value]) => {
        assert(TYPE.token === symbol.type,
            `Type error: Cannot only declare tokens as scoped values, tried to declare ${symbol.type}`)

        scope.tokens[ symbol.value ] = value
    })

    return scope
}

export function lookupOnScopeChain(symbol, scopeChain) {
    assert(TYPE.token === symbol.type,
        `Type error: type ${symbol.type} can not be retrieved from scope`)

    let scope = scopeChain
    while (scope) {
        if (symbol.value in scope.tokens) {
            return scope.tokens[ symbol.value ]
        }

        scope = scope.parent
    }

    assert(false, `Undeclared variable error: token (${symbol.value}) not defined in scope`)
}

const __GLOBAL_SCOPE__ = newScope(builtIns)
