import { runCode } from '../../src/eval'
import { validateParams, greaterThan, greaterThanOrEqualTo, lessThan, lessThanOrEqualTo } from '../../src/logic/numbers'
import { parseString } from '../../src/parser'
import { run } from '../test-run-helper'

describe('logical operands for numbers', () => {
    test('> throws on invalid input', () => {
        expect(() => run('(>)')).toThrow(`Comparison functions take exactly 2 arguments`)
        expect(() => run('(> 1)')).toThrow(`Comparison functions take exactly 2 arguments`)
        expect(() => run('(> 1 2 3)')).toThrow(`Comparison functions take exactly 2 arguments`)
        expect(() => run(`(> 'abc 'def)`)).toThrow(`Comparison functions only work on numbers`)
        expect(() => run(`(> 1 '(2))`)).toThrow(`Comparison functions only work on numbers`)
        expect(() => run('(> 1 null)')).toThrow(`Comparison functions only work on numbers`)
        expect(() => run('(> 1 "2")')).toThrow(`Comparison functions only work on numbers`)
    })

    test('> does logical comparison of numbers', () => {
        expect(run('(> 2 1)')).toBe('true')
        expect(run('(> 2 3)')).toBe('false')
        expect(run('(> 2 2)')).toBe('false')
    })

    test('>= does logical comparison of numbers', () => {
        expect(run('(>= 2 1)')).toBe('true')
        expect(run('(>= 2 3)')).toBe('false')
        expect(run('(>= 2 2)')).toBe('true')
    })

    test('< does logical comparison of numbers', () => {
        expect(run('(< 2 1)')).toBe('false')
        expect(run('(< 2 3)')).toBe('true')
        expect(run('(< 2 2)')).toBe('false')
    })

    test('<= does logical comparison of numbers', () => {
        expect(run('(<= 2 1)')).toBe('false')
        expect(run('(<= 2 3)')).toBe('true')
        expect(run('(<= 2 2)')).toBe('true')
    })

    test('operands are available in program scope', () => {
        expect(run('(> 3 2)')).toBe('true')
        expect(run('(>= 3 2)')).toBe('true')
        expect(run('(< 3 2)')).toBe('false')
        expect(run('(<= 3 2)')).toBe('false')
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
