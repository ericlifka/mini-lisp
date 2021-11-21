import { parseString } from '../src/parser';
import { printToString } from "../src/logger";
import { TYPE } from '../src/types/types';

describe('numbers', () => {
    test('parses a number literal', () => {
        expect(parseString("1")).toEqual({
            type: TYPE.number,
            value: 1
        })
    })

    test('can recognize a negative number', () => {
        expect(parseString('-123')).toHaveProperty("value", -123)
    })

    test('can recognize decimals', () => {
        expect(parseString('.123')).toHaveProperty("value", .123)
        expect(parseString('0.123')).toHaveProperty("value", .123)
        expect(parseString('-.123')).toHaveProperty("value", -.123)
    })
})


describe('strings', () => {
    test('parses a string literal', () => {
        expect(parseString('"abcd"')).toEqual({
            type: TYPE.string,
            value: "abcd"
        })
    })

    test('escape allows quotes to be inside strings', () => {
        expect(parseString('"ab\\"cd"')).toHaveProperty("value", 'ab"cd')
    })
})


describe('tokens', () => {
    test('parses a token literal', () => {
        expect(parseString('some-token')).toEqual({
            type: TYPE.token,
            value: "some-token"
        })
    })

    test('can start a token with a -', () => {
        expect(parseString('-some-token-')).toHaveProperty("value", "-some-token-")
    })    
})


describe('lists', () => {
    test('can recognize a list', () => {
        expect(parseString('()')).toHaveProperty("type", TYPE.list)
        expect(parseString('(1 2 3)')).toHaveProperty("type", TYPE.list)
        expect(parseString('("abc" a-token 123)')).toHaveProperty("type", TYPE.list)
    })

    test('number at end of list', () => {
        expect(printToString(parseString('(123)'))).toBe('(123)')
    })

    test('string at end of list', () => {
        expect(printToString(parseString('("abc")'))).toBe('("abc")')
    })

    test('token at end of list', () => {
        expect(printToString(parseString('(token)'))).toBe("(token)")
    })
})
