import { runCode } from '../../src/eval'
import { printToString } from '../../src/logger'
import { parseString } from '../../src/parser'

describe('(if ...)', () => {
    let run = (input) => printToString(runCode(parseString(input)))

    test('if runs the true path', () => {
        expect(run('(if true 1 2)')).toBe('1')
    })

    test('if runs the false path', () => {
        expect(run('(if false 1 2)')).toBe('2')
    })
})
