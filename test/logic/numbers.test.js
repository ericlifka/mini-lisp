import { runCode } from '../../src/eval'
import { validateParams, greaterThan, greaterThanOrEqualTo, lessThan, lessThanOrEqualTo } from '../../src/logic/numbers'
import { parseString } from '../../src/parser'
import { run } from '../test-run-helper'

describe('logical operands for numbers', () => {
    test('> throws on invalid input', () => {
        expect(() => validateParams(parseString('()'), '>')).toThrow(`> takes exactly 2 arguments`)
        expect(() => validateParams(parseString('(1)'), '>')).toThrow(`> takes exactly 2 arguments`)
        expect(() => validateParams(parseString('(1 2 3)'), '>')).toThrow(`> takes exactly 2 arguments`)
        expect(() => validateParams(parseString('(abc def)'), '>')).toThrow(`> only accepts number arguments`)
        expect(() => validateParams(parseString('(1 (2))'), '>')).toThrow(`> only accepts number arguments`)
        expect(() => validateParams(parseString('(1 null)'), '>')).toThrow(`> only accepts number arguments`)
        expect(() => validateParams(parseString('(1 "2")'), '>')).toThrow(`> only accepts number arguments`)
    })

    test('> does logical comparison of numbers', () => {
        expect(greaterThan(parseString('(2 1)'))).toHaveProperty('value', true)
        expect(greaterThan(parseString('(2 3)'))).toHaveProperty('value', false)
        expect(greaterThan(parseString('(2 2)'))).toHaveProperty('value', false)
    })

    test('>= does logical comparison of numbers', () => {
        expect(greaterThanOrEqualTo(parseString('(2 1)'))).toHaveProperty('value', true)
        expect(greaterThanOrEqualTo(parseString('(2 3)'))).toHaveProperty('value', false)
        expect(greaterThanOrEqualTo(parseString('(2 2)'))).toHaveProperty('value', true)
    })

    test('< does logical comparison of numbers', () => {
        expect(lessThan(parseString('(2 1)'))).toHaveProperty('value', false)
        expect(lessThan(parseString('(2 3)'))).toHaveProperty('value', true)
        expect(lessThan(parseString('(2 2)'))).toHaveProperty('value', false)
    })

    test('<= does logical comparison of numbers', () => {
        expect(lessThanOrEqualTo(parseString('(2 1)'))).toHaveProperty('value', false)
        expect(lessThanOrEqualTo(parseString('(2 3)'))).toHaveProperty('value', true)
        expect(lessThanOrEqualTo(parseString('(2 2)'))).toHaveProperty('value', true)
    })

    test('operands are available in program scope', () => {
        expect(runCode(parseString('(> 3 2)'))).toHaveProperty('value', true)
        expect(runCode(parseString('(>= 3 2)'))).toHaveProperty('value', true)
        expect(runCode(parseString('(< 3 2)'))).toHaveProperty('value', false)
        expect(runCode(parseString('(<= 3 2)'))).toHaveProperty('value', false)
    })
})

describe('arithmatic functions', () => {
    test('+', () => {
        expect(run(`(+ 1 2 3)`)).toBe('6')
        expect(run(`(+ 1)`)).toBe('1')
    })
    test('-', () => {
        expect(run(`(- 1 2 3)`)).toBe('-4')
        expect(run(`(- 1)`)).toBe('1')
    })
    test('*', () => {
        expect(run(`(* 1 2 3)`)).toBe('6')
        expect(run(`(* 3)`)).toBe('3')
    })
    test('/', () => {
        expect(run(`(/ 27 3 3)`)).toBe('3')
        expect(run(`(/ 9 3)`)).toBe('3')
        expect(run(`(/ 5)`)).toBe('5')
    })
})
