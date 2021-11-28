import { runCode } from '../src/eval'
import { printToString } from '../src/logger'
import { parseString } from '../src/parser'
import { createScope } from '../src/scope'
import { nullType, numberType, stringType, tokenType, TYPE } from '../src/types/types'

let run = (input) => printToString(runCode(parseString(input)))

describe('garbage', () => {
    test('throws on garbage for safety', () => {
        expect(() => runCode(null)).toThrow()
    })
    test('throws on unrecognized types', () => {
        expect(() => runCode({ type: 'something-random' })).toThrow()
    })
    test('throws on executing a list without a function', () => {
        expect(() => runCode(parseString('(1 2 3)'))).toThrow()
    })
})

describe('basic types', () => {
    test('basic types evaluate to themselves', () => {
        expect(runCode(numberType(1))).toEqual({ type: TYPE.number, value: 1 })
        expect(runCode(stringType('abc'))).toEqual({
            type: TYPE.string,
            value: 'abc',
        })
        expect(runCode(nullType())).toEqual({ type: TYPE.null })
    })
})

describe('tokens', () => {
    test('tokens are looked up in scope', () => {
        let scope = createScope([[tokenType('a'), numberType(5)]])
        expect(runCode(tokenType('a'), scope)).toEqual({
            type: TYPE.number,
            value: 5,
        })
    })
})
