import { runCode } from '../src/eval'
import {
    addInput,
    checkExpressionReady,
    checkNeedsInput,
    getExpression,
    newReader,
    parseString,
    parseToNextBreak,
} from '../src/parser'
import { TYPE } from '../src/types/types'
import { parse } from './test-run-helper'

describe('numbers', () => {
    test('parses a number literal', () => {
        expect(parseString('1')).toEqual({
            type: TYPE.number,
            value: 1,
        })
    })

    test('can recognize a negative number', () => {
        expect(parseString('-123')).toHaveProperty('value', -123)
    })

    test('can recognize decimals', () => {
        expect(parseString('.123')).toHaveProperty('value', 0.123)
        expect(parseString('0.123')).toHaveProperty('value', 0.123)
        expect(parseString('-.123')).toHaveProperty('value', -0.123)
    })

    test('can recognize scientific notation', () => {
        expect(parseString('1e10')).toHaveProperty('value', 10000000000)
    })

    test('can recognize other bases', () => {
        expect(parseString('0xff')).toHaveProperty('value', 255)
        expect(parseString('0b11111111')).toHaveProperty('value', 255)
        expect(parseString('0o377')).toHaveProperty('value', 255)
    })

    test('invalid numbers are treated as tokens', () => {
        expect(parseString('...123')).toEqual({
            type: TYPE.token,
            value: '...123',
        })
        expect(parseString('1..2')).toEqual({ type: TYPE.token, value: '1..2' })
        expect(parseString('++1')).toEqual({ type: TYPE.token, value: '++1' })
        expect(parseString('12.345.6')).toEqual({
            type: TYPE.token,
            value: '12.345.6',
        })
    })
})

describe('booleans', () => {
    test('parses a boolean literal', () => {
        expect(parseString('true')).toEqual({
            type: TYPE.boolean,
            value: true,
        })
        expect(parseString('false')).toEqual({
            type: TYPE.boolean,
            value: false,
        })
    })
})

describe('strings', () => {
    test('parses a string literal', () => {
        expect(parseString('"abcd"')).toEqual({
            type: TYPE.string,
            value: 'abcd',
        })
    })

    test('escape allows quotes to be inside strings', () => {
        expect(parseString('"ab\\"cd"')).toHaveProperty('value', 'ab"cd')
    })
})

describe('tokens', () => {
    test('parses a token literal', () => {
        expect(parseString('some-token')).toEqual({
            type: TYPE.token,
            value: 'some-token',
        })
    })

    test('can start a token with a -', () => {
        expect(parseString('-some-token-')).toHaveProperty('value', '-some-token-')
    })
})

describe('lists', () => {
    test('can recognize a list', () => {
        expect(parseString('()')).toHaveProperty('type', TYPE.list)
        expect(parseString('(1 2 3)')).toHaveProperty('type', TYPE.list)
        expect(parseString('("abc" a-token 123)')).toHaveProperty('type', TYPE.list)
    })

    test('number at end of list', () => {
        expect(parse('(123)')).toBe('(123)')
    })

    test('string at end of list', () => {
        expect(parse('("abc")')).toBe('("abc")')
    })

    test('token at end of list', () => {
        expect(parse('(token)')).toBe('(token)')
    })

    test('empty list', () => {
        expect(parse('()')).toBe('()')
    })

    test('simple list', () => {
        expect(parse('(1 2 3)')).toBe('(1 2 3)')
    })

    test('nested list', () => {
        expect(parse('(1 (2 (3)))')).toBe('(1 (2 (3)))')
    })

    test('list in first position of list', () => {
        expect(parse('((1 2) 3)')).toBe('((1 2) 3)')
    })

    test('lists can have any type', () => {
        expect(parse('("abc" 123 -some-token-)')).toBe('("abc" 123 -some-token-)')
    })

    test('lists ignore whitespace', () => {
        expect(parse('( 123    "abc"  token )')).toBe('(123 "abc" token)')
    })
})

describe('quote reader macro', () => {
    test("can quote items with ' char", () => {
        expect(parse(`'(1 2 3)`)).toBe(`(quote (1 2 3))`)
    })

    test('escape quotes can be anywhere in the tree', () => {
        expect(parse(`(something '(1 2 3))`)).toBe(`(something (quote (1 2 3)))`)
    })

    test('escape quote works on literal types as well', () => {
        expect(parse(`(something '1 2)`)).toBe(`(something (quote 1) 2)`)
    })

    test('escape on naked literals', () => {
        expect(parse(`'token`)).toBe(`(quote token)`)
        expect(parse(`'"str"`)).toBe(`(quote "str")`)
        expect(parse(`'123`)).toBe(`(quote 123)`)
    })
})

describe('incremental parser', () => {
    test('can parse statements in parts', () => {
        let reader = newReader('(let (x 1')
        parseToNextBreak(reader)
        expect(checkExpressionReady(reader)).toBe(false)
        expect(checkNeedsInput(reader)).toBe(true)
        addInput('  y 2) (+ x y))', reader)
        parseToNextBreak(reader)
        expect(checkExpressionReady(reader)).toBe(true)
        expect(checkNeedsInput(reader)).toBe(false)
        let expr = getExpression(reader)
        let result = runCode(expr)
        expect(result.value).toBe(3)
    })
})
