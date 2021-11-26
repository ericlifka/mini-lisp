import { deepEquals } from '../../src/logic/equals'
import { consType } from '../../src/types/types'
import { run } from '../test-run-helper'

describe('equals fn', () => {
    test('can compare literal types', () => {
        expect(run(`(equal 1 1)`)).toBe('true')
        expect(run(`(equal 'abc 'abc)`)).toBe('true')
        expect(run(`(equal "abc" "abc")`)).toBe('true')
        expect(run(`(equal true true)`)).toBe('true')
        expect(run(`(equal null null)`)).toBe('true')
        expect(run(`(equal null 1)`)).toBe('false')
        expect(run(`(equal 1 "1")`)).toBe('false')
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
    test('compares complex forms like functions by reference check', () => {
        expect(
            run(`(let (my-fn (fn () null)
                          other my-fn)
                        (equal other my-fn))`)
        ).toBe('true')
        expect(
            run(`(let (my-fn (fn () null)
                          other (fn () null))
                        (equal other my-fn))`)
        ).toBe('false')
        expect(run(`(equal fn fn)`)).toBe('true')
        expect(run(`(equal function function)`)).toBe('true')
        expect(run(`(equal function fn)`)).toBe('false')
    })
    test('cons is special for now', () => {
        expect(deepEquals(consType(), consType())).toBe(false)
        let c = consType()
        expect(deepEquals(c, c)).toBe(true)
    })
})
