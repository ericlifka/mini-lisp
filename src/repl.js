import { log, printToString } from './logger'
import { checkNeedsInput, checkExpressionReady, getExpression, newReader, stepReader } from './parser'
import { runCode } from './eval'
import repl from 'repl'
import { newFileScope } from './scope'

export function startRepl() {
    log('<μlisp initiating repl>')

    let replScope = newFileScope('repl')

    repl.start({
        prompt: 'μ> ',
        eval(input, context, filename, cb) {
            let reader = newReader(input)

            let shouldContinue
            do {
                shouldContinue = stepReader(reader)
            } while (shouldContinue)

            if (checkExpressionReady(reader)) {
                let expr = getExpression(reader)
                let result = runCode(expr, replScope)
                let output = printToString(result)

                return cb(null, output)
            }

            if (checkNeedsInput(reader)) {
                return cb(new repl.Recoverable())
            }
        },
    }).addListener('exit', () => log('\nterminating REPL\n'))
}
