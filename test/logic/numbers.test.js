import { run } from '../test-run-helper'

const msg = 'Math functions require exactly two numbers'

describe('logical operands for numbers', () => {
    test('> throws on invalid input', () => {
        expect(() => run('(>)')).toThrow(msg)
        expect(() => run(`(> 'abc 'def)`)).toThrow(msg)
        expect(() => run(`(> 1 '(2))`)).toThrow(msg)
        expect(() => run('(> 1 null)')).toThrow(msg)
        expect(() => run('(> 1 "2")')).toThrow(msg)
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
        expect(run(`(+ 4 2)`)).toBe('6')
        expect(() => run(`(+ 1)`)).toThrow(msg)
    })
    test('-', () => {
        expect(run(`(- 1 2)`)).toBe('-1')
        expect(() => run(`(- 1)`)).toThrow(msg)
    })
    test('*', () => {
        expect(run(`(* 3 2)`)).toBe('6')
        expect(() => run(`(* 3)`)).toThrow(msg)
    })
    test('/', () => {
        expect(run(`(/ 27 3)`)).toBe('9')
        expect(run(`(/ 9 3)`)).toBe('3')
        expect(() => run(`(/ 5)`)).toThrow(msg)
    })
    test('sqrt', () => {
        expect(run(`(sqrt 4)`)).toBe('2')
        expect(() => run(`(sqrt 'abc)`)).toThrow('sqrt only works on numbers')
    })
    test('%', () => {
        expect(run(`(% 4 2)`)).toBe('0')
        expect(() => run(`(% 3 'abc)`)).toThrow(msg)
    })
})
