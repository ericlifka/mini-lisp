import { runCode } from "../../src/eval"
import { printToString } from "../../src/logger"
import { parseString } from "../../src/parser"


describe('let special form', () => {
    let run = input => printToString(runCode(parseString(input)))

    test('can create and use variables', () => {
        expect(run(`(let (x 1) x)`)).toBe("1")
    })

    test('can create multiple variables', () => {
        expect(run(`(let (x 1 y 2) (+ x y))`)).toBe("3")
    })

    test('returns value of last statement in body', () => {
        expect(run(`(let (x 1) 3 x)`)).toBe("1")
    })

    test('can run statements in variable assignment', () => {
        expect(run(`(let (x (+ 1 2)) x)`)).toBe("3")
    })

    test('variables are in scope as they get created', () => {
        expect(run(`(let (x 1 y (+ 1 x)) y)`)).toBe("2")
    })

    test('a dangling symbol will be set to null', () => {
        expect(run(`(let (x) x)`)).toBe("null")
    })

    test('values only stay in scope for the let form', () => {
        expect(run(`(let (x 1)
                        (let (x 3) x)
                        x)`)).toBe("1")
    })
})