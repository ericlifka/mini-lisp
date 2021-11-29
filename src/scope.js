import { stringType, tokenType, TYPE } from './types/types'
import { assert } from './assert'
import builtIns from './language-forms'
import { loadModule } from './loader'
import { loadStandardLibIntoScope } from './standard-lib'

const __LANGUAGE_SCOPE__ = createScope(builtIns, null)
const __GLOBAL_SCOPE__ = createScope([], __LANGUAGE_SCOPE__)

loadStandardLibIntoScope(__LANGUAGE_SCOPE__)

export function getGlobalScope() {
    return __GLOBAL_SCOPE__
}

export function createScope(declaredSymbols, parent) {
    let scope = {
        parent,
        tokens: {},
        imports: {},
    }

    declaredSymbols.forEach(([symbol, value]) => {
        assert(
            TYPE.token === symbol.type,
            `Type error: Can only declare tokens as scoped values, tried to declare ${symbol}`
        )

        scope.tokens[symbol.value] = value
    })

    return scope
}

export function newFileScope(filename) {
    return createScope([[tokenType(':file-name'), stringType(filename)]], getGlobalScope())
}

export function isGlobalScope(scope) {
    return scope === __GLOBAL_SCOPE__
}

export function isLanguageScope(scope) {
    return scope === __LANGUAGE_SCOPE__
}

export function createModule(token, parent = getGlobalScope()) {
    assert(token.type === TYPE.token, `Module must be attached to a symbol`)
    let name = token.value
    let modules = lookupOnScope(__LANGUAGE_SCOPE__, tokenType('modules'))
    assert(!(name in modules), `Module ${name} already exists`)
    let newModule = createScope([], parent)
    modules[name] = newModule

    return newModule
}

export function lookupModule(token) {
    assert(token.type === TYPE.token, `Modules must be looked up by an associated symbol`)

    let modules = lookupOnScope(__LANGUAGE_SCOPE__, tokenType('modules'))

    if (!(token.value in modules)) {
        loadModule(token)

        assert(token.value in modules, `Module loader couldn't find module ${token.value}`)
    }

    return modules[token.value]
}

export function lookupOnScope(scope, symbol) {
    assert(TYPE.token === symbol.type, `Type error: type ${symbol.type} can not be retrieved from scope`)

    return scope.tokens[symbol.value]
}

export function lookupOnScopeChain(scopeChain, symbol) {
    assert(TYPE.token === symbol.type, `Type error: type ${symbol.type} can not be retrieved from scope`)

    let [name, module] = moduleFromSymbolName(symbol)

    if (module) {
        return lookupModuleToken(scopeChain, name, module)
    } else {
        return lookupVariableToken(scopeChain, name)
    }
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
    assert(!/.+\/.+/.test(symbol.value), `Can't declare variable matching module lookup signature: ${symbol.value}`)

    scope.tokens[symbol.value] = value
}

function moduleFromSymbolName(symbol) {
    let str = symbol.value
    if (/.+\/.+/.test(str)) {
        let parts = symbol.value.split('/')
        if (parts.length === 2) {
            return [parts[1], parts[0]]
        } else {
            assert(false, `Symantic error: can only have one module lookup in a symbol`)
        }
    } else {
        return [str, null]
    }
}

function lookupModuleToken(scope, name, module) {
    while (scope) {
        if (module in scope.imports) {
            let importedModule = scope.imports[module]
            assert(name in importedModule.tokens, `Lexical error: ${name} not in module ${module}`)

            return importedModule.tokens[name]
        }

        scope = scope.parent
    }

    assert(false, `Lexical error: ${module} not imported in this scope`)
}

function lookupVariableToken(scope, name) {
    while (scope) {
        if (name in scope.tokens) {
            return scope.tokens[name]
        }

        scope = scope.parent
    }

    assert(false, `Undeclared variable error: token (${name}) not defined in scope`)
}
