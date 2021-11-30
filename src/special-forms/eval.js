import { runCode } from '../eval'
import { listGetAtIndex } from '../types/list'
import { specialFormType, tokenType } from '../types/types'

export default [
    tokenType('eval'),
    specialFormType(`(eval s-expr)`, (params, scope) => {
        let param = listGetAtIndex(params, 0)
        let sExpr = runCode(param, scope)
        let result = runCode(sExpr, scope)

        return result
    }),
]
