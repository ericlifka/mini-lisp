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
    const parse = input => printToString(parseString(input))

    test('can recognize a list', () => {
        expect(parseString('()')).toHaveProperty("type", TYPE.list)
        expect(parseString('(1 2 3)')).toHaveProperty("type", TYPE.list)
        expect(parseString('("abc" a-token 123)')).toHaveProperty("type", TYPE.list)
    })

    test('number at end of list', () => {
        expect(parse('(123)')).toBe('(123)')
    })

    test('string at end of list', () => {
        expect(parse('("abc")')).toBe('("abc")')
    })

    test('token at end of list', () => {
        expect(parse('(token)')).toBe("(token)")
    })

    test('empty list', () => {
        expect(parse("()")).toBe("()")
    })
    
    test('simple list', () => {
        expect(parse("(1 2 3)")).toBe("(1 2 3)")
    })
    
    test('nested list', () => {
        expect(parse("(1 (2 (3)))")).toBe("(1 (2 (3)))")
    })
    
    test('list in first position of list', () => {
        expect(parse("((1 2) 3)")).toBe("((1 2) 3)")
    })
    
    test('lists can have any type', () => {
        expect(parse('("abc" 123 -some-token-)')).toBe('("abc" 123 -some-token-)')
    })
    
    test('lists ignore whitespace', () => {
        expect(parse('( 123    "abc"  token )')).toBe('(123 "abc" token)')
    })
})
