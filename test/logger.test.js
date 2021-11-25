import { printToString, log } from '../src/logger'
import { parseString } from '../src/parser'
import { runCode } from '../src/eval'
import {
    numberType,
    stringType,
    tokenType,
    nullType,
    consType,
    booleanType,
} from '../src/types/types'

describe('printToString', () => {
    test('can print a number', () => {
        expect(printToString(numberType(5))).toBe('5')
    })

    test('can print a string', () => {
        expect(printToString(stringType('abc'))).toBe('"abc"')
        expect(printToString(stringType('a"bc'))).toBe('"a\\"bc"')
        expect(printToString(stringType(''))).toBe('""')
    })

    test('can print a boolean', () => {
        expect(printToString(booleanType(true))).toBe('true')
        expect(printToString(booleanType(false))).toBe('false')
    })

    test('can print a token', () => {
        expect(printToString(tokenType('-some-token-'))).toBe('-some-token-')
    })

    test('can print null', () => {
        expect(printToString(nullType())).toBe('null')
    })

    test('can print a cons cell', () => {
        expect(printToString(consType(numberType(5)))).toBe('(5, null)')
    })

    test('can print a built in function', () => {
        expect(printToString(runCode(parseString('+')))).toBe(
            '(fn + ...numbers)',
        )
    })
})

describe('log', () => {
    test('should send info to console', () => {
        const logSpy = jest.spyOn(console, 'log')
        log('something')
        expect(logSpy).toBeCalledWith('something')
    })
})
