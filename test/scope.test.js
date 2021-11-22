import { lookupOnScopeChain, createScope } from "../src/scope"
import { stringType, tokenType, TYPE } from "../src/types/types"

describe('scopes', () => {

    let create = (sym, strVal, parent) => createScope([
        [tokenType(sym), stringType(strVal)]
    ], parent)

    let lookup = (sym, scope) => lookupOnScopeChain(tokenType(sym), scope)

    test('can look up a value on a scope', () => {
        let scope = create('a', 'abc')
        expect(lookup('a', scope)).toEqual({ type: TYPE.string, value: "abc" })
    })

    test('throws an error if lookup symbol isnt defined anywhere in the chain', () => {
        let scope = create('a', 'abc')
        expect(() => lookup('b', scope)).toThrow()
    })

    test('values down the chain eclipse but dont overwrite values up the chain', () => {
        let parent = create('a', 'abc')
        let child = create('a', 'def', parent)

        expect(lookup('a', child)).toHaveProperty('value', "def")
        expect(lookup('a', parent)).toHaveProperty('value', "abc")
    })
})