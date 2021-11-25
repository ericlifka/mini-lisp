import { run } from '../test-run-helper'

describe('logic helpers for booleans', () => {
    test('(bool expr) determines if something is truthy', () => {
        expect(run(`(bool false)`)).toBe('false')
        expect(run(`(bool null)`)).toBe('false')
        expect(run(`(bool 1)`)).toBe('true')
        expect(run(`(bool 0)`)).toBe('false')
        expect(run(`(bool '(false))`)).toBe('true')
        expect(run(`(bool '())`)).toBe('false')
        expect(run(`(bool "")`)).toBe('false')
    })
    test('(not expr) determines if something is falsey', () => {
        expect(run(`(not false)`)).toBe('true')
        expect(run(`(not null)`)).toBe('true')
        expect(run(`(not 1)`)).toBe('false')
        expect(run(`(not 0)`)).toBe('true')
        expect(run(`(not '(false))`)).toBe('false')
        expect(run(`(not '())`)).toBe('true')
        expect(run(`(not "")`)).toBe('true')
    })

    test('(or ...exprs)', () => {
        expect(run(`(or false)`)).toBe('false')
        expect(run(`(or false false)`)).toBe('false')
        expect(run(`(or true)`)).toBe('true')
        expect(run(`(or false true)`)).toBe('true')
        expect(run(`(or 0 1)`)).toBe('1')
        expect(run(`(or false '(1 2))`)).toBe('(1 2)')
    })

    test('(and ...exprs)', () => {
        expect(run(`(and false)`)).toBe('false')
        expect(run(`(and false false)`)).toBe('false')
        expect(run(`(and true)`)).toBe('true')
        expect(run(`(and false true)`)).toBe('false')
        expect(run(`(and true true)`)).toBe('true')
        expect(run(`(and 0 1)`)).toBe('0')
        expect(run(`(and false '(1 2))`)).toBe('false')
        expect(run(`(and true '(1 2))`)).toBe('(1 2)')
    })
})
