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

(function not-null (param)
  (not (is-null param)))

(function median (numbers)
  (let (sorted (sort sort-ascending numbers)
        len    (length sorted)
        mid    (/ (decr len) 2))
    (/ (+ (get sorted (floor mid))
          (get sorted (ceil mid)))
       2)))

(function addr (left right) (+ left right))

(function mean (numbers)
  (/ (reduce addr numbers) (length numbers)))

(function min (...numbers)
  (let (min   (first numbers)
        queue (rest numbers))
    (loop :while (> (length queue) 0)
      (if (< (first queue) min)
        (update min (first queue))
        null)
      (update queue (rest queue)))
    min))

(function max (...numbers)
    (let (max   (first numbers)
          queue (rest numbers))
      (loop :while (> (length queue) 0)
        (if (> (first queue) max)
          (update max (first queue)) null)
        (update queue (rest queue)))
      max))

(function matrix-protected-getter (matrix)
  (let (ymax (length matrix)
        xmax (length (get matrix 0)))
    (fn (x y)
      (if (or (< x 0)
              (< y 0)
              (>= x xmax)
              (>= y ymax))
        null
        (matrix-get matrix x y)))))

(function reverse (lst)
  (if (== 0 (length lst))
    '()
    (concat (reverse (rest lst)) (list (first lst)))))

(declare-macro declare-memoized (name params ...body)
  \`(declare ,name (memoize (fn ,params ,(cons 'do body)))))
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
