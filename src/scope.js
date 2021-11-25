import { TYPE } from "./types/types"
import { assert } from "./assert"
import builtIns from "./language-forms"

const __LANGUAGE_SCOPE__ = createScope(builtIns)
const __GLOBAL_SCOPE__ = createScope([], __LANGUAGE_SCOPE__)

export function getGlobalScope() {
    return __GLOBAL_SCOPE__
}

export function createScope(declaredSymbols, parent = getGlobalScope()) {
    let scope = {
        parent, 
        tokens: { }
    }

    declaredSymbols.forEach(([symbol, value]) => {
        assert(TYPE.token === symbol.type,
            `Type error: Cannot only declare tokens as scoped values, tried to declare ${symbol}`)

        scope.tokens[ symbol.value ] = value
    })

    return scope
}

export function lookupOnScope(scope, symbol) {
    assert(TYPE.token === symbol.type, `Type error: type ${symbol.type} can not be retrieved from scope`)
    
    return scope.tokens[ symbol.value ]
}

export function lookupOnScopeChain(scopeChain, symbol) {
    assert(TYPE.token === symbol.type, `Type error: type ${symbol.type} can not be retrieved from scope`)

    let scope = scopeChain
    while (scope) {
        if (symbol.value in scope.tokens) {
            return scope.tokens[ symbol.value ]
        }

        scope = scope.parent
    }

    assert(false, `Undeclared variable error: token (${symbol.value}) not defined in scope`)
}

export function findDeclaredInScope(scopeChain, symbol) {
    assert(TYPE.token === symbol.type, `Type error: type ${symbol.type} can not be retrieved from scope`)

    let scope = scopeChain
    while (scope) {
        if (symbol.value in scope.tokens) {
            return scope
        }

        scope = scope.parent
    }

    return null
}

export function setOnScope(scope, symbol, value) {
    assert(TYPE.token === symbol.type, `Type error: type ${symbol.type} can not be set on scope`)
    
    scope.tokens[ symbol.value ] = value
}
