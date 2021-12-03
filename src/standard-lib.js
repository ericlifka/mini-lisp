import { runCode } from './eval'
import { checkExpressionReady, checkNeedsInput, getExpression, newReader, parseToNextBreak } from './parser'

const stdLib = `
(declare-macro ++ (param)
  \`(update ,param (+ ,param 1)))

(declare-macro -- (param)
  \`(update ,param (- ,param 1)))

(declare-macro not-null (param)
  \`(not (is-null ,param)))
`

export function loadStandardLibIntoScope(scope) {
    const reader = newReader(stdLib)

    while (!checkNeedsInput(reader)) {
        parseToNextBreak(reader)

        if (checkExpressionReady(reader)) {
            runCode(getExpression(reader), scope)
        }
    }
}
