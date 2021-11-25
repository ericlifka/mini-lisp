import { run } from "../test-run-helper"

describe('list special form', () => {
    test('creates a list from parameters', () => {
        expect(run(`(list 1 2 3)`)).toBe(`(1 2 3)`)
    })

    test('parameters are evaluated', () => {
        expect(run(`(list 1 2 (+ 1 2))`)).toBe(`(1 2 3)`)
    })
})
