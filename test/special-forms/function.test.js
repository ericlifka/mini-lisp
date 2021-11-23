import { runCode } from "../../src/eval"
import { printToString } from "../../src/logger"
import { parseString } from "../../src/parser"
import { TYPE } from "../../src/types/types"

describe('(fn ...)', () => {
    let run = input => printToString(runCode(parseString(input)))

    test('fn creates a function type', () => {
        expect(runCode(parseString('(fn () 3)'))).toHaveProperty('type', TYPE.function)
    })

    test('fn type call be called', () => {
        expect(run('((fn () 3))')).toBe("3")
    })

    test('fn type creates scoped parameter variables', () => {
        expect(run('((fn (x) (+ x 3)) 2)')).toBe("5")
    })
})
