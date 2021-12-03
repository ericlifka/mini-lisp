import { cons, listFirst, listRest } from '../types/list'
import { nullType, specialFormType, tokenType } from '../types/types'
import { runCode } from '../eval'
import { isTruthy } from '../logic/booleans'

function whileSpecialForm(params, scope) {
    let boolExpression = listFirst(params)
    let bodyExpressions = cons(tokenType('do'), listRest(params))
    let result = nullType()

    while (true) {
        if (isTruthy(runCode(boolExpression, scope))) {
            result = runCode(bodyExpressions, scope)
        } else {
            return result
        }
    }
}

export default [tokenType('while'), specialFormType(`(while boolean ...code)`, whileSpecialForm)]
