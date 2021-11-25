import { runCode } from '../../src/eval'
import { parseString } from '../../src/parser'
import { TYPE } from '../../src/types/types'
import { run } from '../test-run-helper'

describe.only('(fn ...)', () => {
    test('fn creates a function type', () => {
        expect(runCode(parseString('(fn () 3)'))).toHaveProperty(
            'type',
            TYPE.function,
        )
    })

    test('fn can be provided a name token', () => {
        expect(runCode(parseString('(fn my-name () 3)'))).toHaveProperty(
            'type',
            TYPE.function,
        )
    })

    test('fn type call be called', () => {
        expect(run('((fn () 3))')).toBe('3')
    })

    test('fn type creates scoped parameter variables', () => {
        expect(run('((fn (x) (+ x 3)) 2)')).toBe('5')
    })

    test('functions can be set to variables and called', () => {
        expect(
            run(`
        (let (add (fn (x) (+ 1 x)))
          (add 3))
        `),
        ).toBe('4')
    })

    test('functions can be called recursively', () => {
        expect(
            run(`
        (let (to-ten (fn (x)
                       (if (< x 10)
                         (recur (+ 1 x))
                         10)))
          (to-ten 1))
        `),
        ).toBe('10')
    })

    test('functions provide their own name in the scope', () => {
        expect(
            run(`
        (let (x1 (fn x2 (x) 
                   (if (< x 10) 
                     (x2 (+ 1 x)) 
                     10)))
          (x1 1))
        `),
        ).toBe('10')
    })

    test('special ... params capture the remainder of the parameters in a list', () => {
        expect(
            run(`
        (let (my-fn (fn (first ...rest) rest))
          (my-fn 1 2 3 4))
        `),
        ).toBe('(2 3 4)')
    })

    test('functions can be called with extra parameters that are ignored', () => {
        expect(
            run(`
        (let (my-fn (fn (first) first))
          (my-fn 10 20))
        `),
        ).toBe('10')
    })

    test('functions can be called with fewer parameters and ones not provided are null', () => {
        expect(
            run(`
        (let (my-fn (fn (first second third) third))
          (my-fn 1))
        `),
        ).toBe('null')
    })

    test('functions will turn a ... param into an empty list if there arent enough params', () => {
        expect(
            run(`
        (let (my-fn (fn (first ...rest) rest))
          (my-fn 1))
        `),
        ).toBe('()')
    })
})
