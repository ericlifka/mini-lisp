import { runCode } from './eval'
import { checkExpressionReady, getExpression, newReader, parseToNextBreak } from './parser'

const stdLib = `
(defmacro ++ (param)
  \`(update ,param (+ ,param 1)))

(defmacro -- (param)
  \`(update ,param (- ,param 1)))

(defmacro not-null (param)
  \`(not (is-null ,param)))
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
