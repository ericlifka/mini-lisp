import { log, printToString } from './logger'
import { checkNeedsInput, checkExpressionReady, getExpression, newReader, stepReader } from './parser'
import { runCode } from './eval'
import repl from 'repl'

export function start() {
    log('<μlisp repl>')

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
                let result = runCode(expr)
                let output = printToString(result)

                return cb(null, output)
            }

            if (checkNeedsInput(reader)) {
                return cb(new repl.Recoverable())
            }
        },
    }).addListener('exit', () => log('\nterminating REPL\n'))
}
