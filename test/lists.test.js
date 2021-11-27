import { run } from './test-run-helper'

describe('list function', () => {
    test('creates a list from parameters', () => {
        expect(run(`(list 1 2 3)`)).toBe(`(1 2 3)`)
    })

    test('parameters are evaluated', () => {
        expect(run(`(list 1 2 (+ 1 2))`)).toBe(`(1 2 3)`)
    })

    test('can create an empty list', () => {
        expect(run(`(list)`)).toBe('()')
    })
})

describe('cons function', () => {
    test('puts item at front of list', () => {
        expect(run(`(cons 1 '(2 3))`)).toBe('(1 2 3)')
    })
    test('can use with null to make lists', () => {
        expect(run(`(cons 1)`)).toBe('(1)')
        expect(run(`(cons 1 null)`)).toBe('(1)')
        expect(run(`(cons 1 '())`)).toBe('(1)')
    })
    test('can make standalone cons cells', () => {
        expect(run(`(cons 1 2)`)).toBe('(1, 2)')
    })
})

describe('first function', () => {
    test('gets first element of a list', () => {
        expect(run(`(first '(1 2 3))`)).toBe('1')
    })
    test('can be called on empty list and null', () => {
        expect(run(`(first)`)).toBe('null')
        expect(run(`(first null)`)).toBe('null')
        expect(run(`(first '())`)).toBe('null')
    })
    test('works on cons cells', () => {
        expect(run(`(first (cons 1 2))`)).toBe('1')
    })
    test('rejects other types', () => {
        expect(() => run(`(first 'abc)`)).toThrow(`(first) requires a list or list like entity`)
    })
})

describe('rest function', () => {
    test('gets the rest of a list after the first element', () => {
        expect(run(`(rest '(1 2 3))`)).toBe('(2 3)')
        expect(run(`(rest '(1))`)).toBe('()')
    })
    test('can be called on empty list and null', () => {
        expect(run(`(rest)`)).toBe('()')
        expect(run(`(rest null)`)).toBe('()')
        expect(run(`(rest '())`)).toBe('()')
    })
    test('works on cons cells', () => {
        expect(run(`(rest (cons 1 2))`)).toBe('2')
    })
    test('rejects other types', () => {
        expect(() => run(`(rest 'abc)`)).toThrow(`(rest) requires a list or list like entity`)
    })
})

describe('length function', () => {
    test('gets the length of a list', () => {
        expect(run(`(length '())`)).toBe('0')
        expect(run(`(length '(1 2 3))`)).toBe('3')
        expect(run(`(length null)`)).toBe('0')
    })

    test('doesnt work on non list types', () => {
        expect(() => run(`(length 3)`)).toThrow(`(length) only works on lists`)
    })
})
