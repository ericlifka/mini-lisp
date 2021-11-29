import { runCode } from './eval'
import { checkExpressionReady, getExpression, newReader, parseToNextBreak } from './parser'

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
            runCode(getExpression(reader), scope)
        }
    })
}
