import { assert } from '../assert'
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

    let parameterList = first.value
    let bodyPtr = first.next
    assert(listAllOneType(parameterList, TYPE.token), `<runnable: only tokens can be provided as parameters>`)

    let runnableEntity = runnableType(
        `(${name ? name.value : 'anonymous'} ${printToString(parameterList)} ...)`,
        (params) => {
            let scopeParams = [[tokenType('recur'), runnableEntity]]
            if (name && name.value !== 'recur') {
                scopeParams.push([name, runnableEntity])
            }

            let tokensPtr = parameterList.head
            let valuesPtr = params.head
            while (tokensPtr.type !== TYPE.null) {
                let currentToken = tokensPtr.value
                let value

                if (currentToken.value.slice(0, 3) === '...') {
                    // this is a rest param
                    assert(
                        tokensPtr.next.type === TYPE.null,
                        `<runnable: ...spread parameter can only be at end of parameters list`
                    )

                    currentToken = tokenType(currentToken.value.slice(3))
                    value = valuesPtr.type === TYPE.null ? listType() : promoteConsToList(valuesPtr)

                    valuesPtr = nullType() // move pointer to end of list because all params have been consumed
                } else {
                    value = valuesPtr.type === TYPE.null ? nullType() : valuesPtr.value
                }

                scopeParams.push([currentToken, value])

                tokensPtr = tokensPtr.next
                if (valuesPtr.type !== TYPE.null) {
                    valuesPtr = valuesPtr.next
                }
            }

            let functionScope = createScope(scopeParams, creationScope)
            let body = bodyPtr
            let evalResult

            while (body.type !== TYPE.null) {
                evalResult = runCode(body.value, functionScope)

                body = body.next
            }

            return evalResult
        }
    )

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
