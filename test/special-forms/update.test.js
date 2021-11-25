import { run } from '../test-run-helper'

describe('update special form', () => {
    test('update changes a value already declared on the scope', () => {
        expect(
            run(`(let (x 4)
                        (update x 5)
                        x)`),
        ).toBe('5')
    })

    test('update finds the nearest scope the variable was declared on', () => {
        expect(
            run(`(let (x 1)
                        (let ()
                            (update x 4))
                        x)`),
        ).toBe('4')
    })

    test('update cant change a symbol not in the scope chain', () => {
        expect(() =>
            run(`(let () 
                             (update x 3)
                             x)`),
        ).toThrow(`Error: symbol x not declared anywhere in scope`)
    })
})
