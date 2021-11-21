import { printToString, log } from "../src/logger";
import { numberType, stringType, tokenType, nullType, consType } from "../src/types/types";

describe('printToString', () => {
    test('can print a number', () => {
        expect(printToString(numberType(5))).toBe("5")
    })

    test('can print a string', () => {
        expect(printToString(stringType("abc"))).toBe('"abc"')
        expect(printToString(stringType('a"bc'))).toBe('"a\\"bc"')
        expect(printToString(stringType(""))).toBe('""')
    })

    test('can print a token', () => {
        expect(printToString(tokenType("-some-token-"))).toBe('-some-token-')
    })

    test('can print null', () => {
        expect(printToString(nullType())).toBe("null")
    })

    test('can print a cons cell', () => {
        expect(printToString(consType(numberType(5)))).toBe('(5, null)')
    })
})

describe('log', () => {
    test('should send info to console', () => {
        const logSpy = jest.spyOn(console, 'log')
        log('something')
        expect(logSpy).toBeCalledWith('something')
    })
})