import { runCode } from './eval'
import { log, printToString } from './logger'
import { checkExpressionReady, checkNeedsInput, getExpression, newReader, parseToNextBreak } from './parser'

const stdLib = `
(defmacro ++1 (param)
  (cons '+ (cons 1 (cons param))))

(defmacro --1 (param)
  (cons '- (cons param (cons 1))))
`

export function loadStandardLibIntoScope(scope) {
    let statements = stdLib.split('\n\n')
    statements.forEach((statement) => {
        let reader = newReader(statement)

        parseToNextBreak(reader)

        if (checkExpressionReady(reader)) {
            let expr = getExpression(reader)
            runCode(expr, scope)
            libFunctions++
        }
    })
}
