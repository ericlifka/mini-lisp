import { cons, first, rest } from '../types/list'
import { nullType, specialFormType, tokenType } from '../types/types'
import { runCode } from '../eval'
import { isTruthy } from '../logic/booleans'

function whileSpecialForm(params, scope) {
    let boolExpression = first(params)
    let bodyExpressions = cons(tokenType('do'), rest(params))
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