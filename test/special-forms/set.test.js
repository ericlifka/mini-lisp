import { run } from "../test-run-helper"

describe('set special form', () => {
    test('set puts a value onto the scope', () => {
        expect(run(`(let ()
                        (set x 4)
                        x)`)).toBe("4")
    })

    test('set only touches the nearest scope', () => {
        expect(run(`(let (x 1)
                        (let ()
                            (set x 4))
                        x)`)).toBe("1")
    })

    test('set cant change a symbol already on the scope', () => {
        expect(() => run(`(let (x 1) (set x 3) x)`)).toThrow(`Error: symbol x already declared at this scope`)
    })
})