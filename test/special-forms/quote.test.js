import { run } from '../test-run-helper'

describe('quote special form', () => {
    test('quote prevents something from being evaluated', () => {
        expect(run(`(quote (+ 1 2))`)).toBe(`(+ 1 2)`)
    })

    test("quote can be shorthanded with ' char in the reader", () => {
        expect(run(`'(+ 1 2)`)).toBe(`(+ 1 2)`)
    })

    test('quote rejects more than one parameter', () => {
        expect(() => run(`(quote 1 2 3)`)).toThrow()
    })
})
