import { runCode } from "../src/eval"
import { printToString } from "../src/logger"
import { parseString } from "../src/parser"

describe('builtin functions', () => {
    let run = input => printToString(runCode(parseString(input)))

    describe('+', () => {
        test('can add numbers with +', () => {
            expect(run('(+ 1 2)')).toBe("3")
        })
    
        test('can handle no arguments', () => {
            expect(run('(+)')).toBe("0")
        })

        test('can handle a single argument', () => {
            expect(run('(+ 1)')).toBe("1")
        })
    })
})