import { run } from '../test-run-helper'

describe('macros', () => {
    test('can declare and use a simple macro', () => {
        expect(
            run(`
        (let ()
          (defmacro 1++ (x)
            (list + 1 x))

          (1++ 3))
        `)
        ).toBe('4')
    })

    test('macros can be anonymous', () => {
        expect(
            run(`
        (let (1++ (macro (x) (list + 1 x)))
          (1++ 2))`)
        ).toBe('3')
    })
})
