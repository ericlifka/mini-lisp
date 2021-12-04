import { runCode } from './eval'
import { checkExpressionReady, checkNeedsInput, getExpression, newReader, parseToNextBreak } from './parser'

const stdLib = `
(declare-macro ++ (param)
  \`(update ,param (+ ,param 1)))

(declare-macro -- (param)
  \`(update ,param (- ,param 1)))

(declare-macro not-null (param)
  \`(not (is-null ,param)))

(function matrix-add (left right)
  (map 
    (fn (l i) (let (r (get right i))
      (cond
        ((and (is-vector l) (is-vector r))
         (matrix-add l r))

        ((and (is-number l) (is-number r))
         (+ l r))

        (true (throw "matrix-add encountered mismatched types" l r)))))
    left))
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
