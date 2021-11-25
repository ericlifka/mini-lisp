import { run } from "../test-run-helper";

describe('logic helpers for booleans', () => {
    test('(bool expr) everything is true except false and null', () => {
        expect(run(`(bool false)`)).toBe('false')
        expect(run(`(bool null)`)).toBe('false')
        expect(run(`(bool 1)`)).toBe('true')
        expect(run(`(bool 0)`)).toBe('false')
        expect(run(`(bool '(false))`)).toBe('true')
        expect(run(`(bool '())`)).toBe('false')
    })
    test('(not expr) returns the inverse of (bool)', () => {
        expect(run(`(not false)`)).toBe('true')
        expect(run(`(not null)`)).toBe('true')
        expect(run(`(not 1)`)).toBe('false')
        expect(run(`(not 0)`)).toBe('true')
        expect(run(`(not '(false))`)).toBe('false')
        expect(run(`(not '())`)).toBe('true')
    })
})