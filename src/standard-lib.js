import { runCode } from './eval'
import { checkExpressionReady, checkNeedsInput, getExpression, newReader, parseToNextBreak } from './parser'

const stdLib = `
(declare-macro != (left right)
  \`(not (== ,left ,right)))

(declare-macro ++ (param)
  \`(update ,param (+ ,param 1)))

(declare-macro -- (param)
  \`(update ,param (- ,param 1)))

(function incr (num)
  (if (is-null num) 1 (+ num 1)))

(function decr (num)
  (if (is-null num) -1 (- num 1)))

(declare-macro not-null (param)
  \`(not (is-null ,param)))

(function median (numbers)
  (let (len (length numbers)
        mid (/ (decr len) 2))
    (/ (+ (get numbers (floor mid))
          (get numbers (ceil mid)))
       2)))

(function addr (left right) (+ left right))

(function mean (numbers)
  (/ (reduce addr numbers) (length numbers)))

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

(function min (...numbers)
  (let (min   (first numbers)
        queue (rest numbers))
    (while (> (length queue) 0)
      (if (< (first queue) min)
        (update min (first queue))
        null)
      (update queue (rest queue)))
    min))

(function max (...numbers)
    (let (max   (first numbers)
          queue (rest numbers))
      (while (> (length queue) 0)
        (if (> (first queue) max)
          (update max (first queue)) null)
        (update queue (rest queue)))
      max))

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
