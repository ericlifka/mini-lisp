/*
(cond
    ((> 0 x) (print "positive"))
    ((< 0 x) (print "negative"))
    (true (print "zero")))
*/

import { runCode } from '../eval'
import { isTruthy } from '../logic/booleans'
import { listGetAtIndex } from '../types/list'
import { nullType, specialFormType, tokenType, TYPE } from '../types/types'

function condSpecialForm(params, scope) {
    let ptr = params.head
    while (ptr.type !== TYPE.null) {
        let condition = listGetAtIndex(ptr.value, 0)
        let statement = listGetAtIndex(ptr.value, 1)
        let condResult = runCode(condition, scope)
        if (isTruthy(condResult)) {
            return runCode(statement, scope)
        }

        ptr = ptr.next
    }

    return nullType()
}

export default [tokenType('cond'), specialFormType(`(cond ...)`, condSpecialForm)]
