import { run } from '../test-run-helper'

describe('equals fn', () => {
    test('can compare literal types', () => {
        expect(run(`(equal 1 1)`)).toBe('true')
        expect(run(`(equal 'abc 'abc)`)).toBe('true')
        expect(run(`(equal "abc" "abc")`)).toBe('true')
        expect(run(`(equal true true)`)).toBe('true')
        expect(run(`(equal null null)`)).toBe('true')
        expect(run(`(equal null 1)`)).toBe('false')
        expect(run(`(equal "abc" 'abc)`)).toBe('false')
        expect(run(`(equal 1 0)`)).toBe('false')
    })
    test('can compare lists', () => {
        expect(run(`(equal '(1 2 3) '(1 2 3))`)).toBe('true')
        expect(run(`(equal '(1 2 3) '(1 2))`)).toBe('false')
        expect(run(`(equal '(1 2 3) '(1 2 4))`)).toBe('false')
    })
    test('can go deep in nested lists', () => {
        expect(run(`(equal '(1 2 (3)) '(1 2 (3)))`)).toBe('true')
        expect(run(`(equal '(1 2 (3)) '(1 2 (4)))`)).toBe('false')
    })
    test.only('compares complex forms like functions by reference check', () => {
        expect(
            run(`(let (my-fn (fn () null)
                          other my-fn)
                        (equal other my-fn))`),
        ).toBe('true')
        expect(
            run(`(let (my-fn (fn () null)
                          other (fn () null))
                        (equal other my-fn))`),
        ).toBe('false')
    })
})
