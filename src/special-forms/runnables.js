import { assert } from '../assert'
import { matchListParameter } from '../destructuring'
import { runCode } from '../eval'
import { printToString } from '../logger'
import { createScope } from '../scope'
import { listAllOneType, promoteConsToList, cons, listFirst, listRest, toList } from '../types/list'
import { tokenType, specialFormType, functionType, nullType, listType, TYPE, macroType } from '../types/types'

export const runnable = (runnableType) => (argsList, creationScope) => {
    let name = null
    let first = argsList.head
    if (TYPE.token === first.value.type) {
        name = first.value
        first = first.next
    }
    assert(TYPE.list === first.value.type, `<runnable: must provide parameter list>`)

    let params = first.value
    let bodyPtr = first.next

    let runnableEntity = runnableType(`(${name ? name.value : 'anonymous'} ${printToString(params)} ...)`, (args) => {
        let scopeParams = matchListParameter(params, args)

        scopeParams.push([tokenType('recur'), runnableEntity])
        if (name && name.value !== 'recur') {
            scopeParams.push([name, runnableEntity])
        }

        let functionScope = createScope(scopeParams, creationScope)
        let body = bodyPtr
        let evalResult

        while (body.type !== TYPE.null) {
            evalResult = runCode(body.value, functionScope)

            body = body.next
        }

        return evalResult
    })

    return runnableEntity
}

export const runnableShorthandMacro = (type) => (argList) => {
    /*Converts: (function my-fn (...args) ...body)
     * to:      (declare my-fn (fn my-fn (...args) ...body))
     *
     * Converts: (defmacro my-macro (...args) ...body)
     * to:       (declare my-macro (macro my-macro (...args) ...body))
     */
    let nameToken = listFirst(argList)
    let bodyList = listRest(argList)

    assert(nameToken.type === TYPE.token, `First param to a runnable macro must be a name token`)

    let runnable = cons(tokenType(type), cons(nameToken, bodyList))

    return toList(tokenType('declare'), nameToken, runnable)
}

export default [
    [tokenType('fn'), specialFormType('<fn special form>', runnable(functionType))],
    [tokenType('macro'), specialFormType('<macro special form>', runnable(macroType))],
    [tokenType('function'), macroType('<function macro>', runnableShorthandMacro('fn'))],
    [tokenType('declare-fn'), macroType('<function macro>', runnableShorthandMacro('fn'))],
    [tokenType('declare-macro'), macroType('<defmacro macro>', runnableShorthandMacro('macro'))],
]
