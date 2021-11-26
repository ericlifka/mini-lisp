import { assert } from '../assert'
import { runCode } from '../eval'
import { printToString } from '../logger'
import { createScope } from '../scope'
import { listAllOneType, promoteConsToList, cons, first, rest, toList } from '../types/list'
import { tokenType, specialFormType, functionType, nullType, listType, TYPE, macroType } from '../types/types'

export function fnSpecialForm(argsList, creationScope) {
    let name = null
    let first = argsList.head
    if (TYPE.token === first.value.type) {
        name = first.value
        first = first.next
    }
    assert(TYPE.list === first.value.type, `<fn special form: must provide parameter list>`)

    let parameterList = first.value
    let bodyPtr = first.next
    assert(
        listAllOneType(parameterList, TYPE.token),
        `<fn special form: only tokens can be provided as parameters, got ${JSON.stringify(parameterList, null, 2)}>`
    )

    let functionEntity = functionType(`(${name ? name.value : 'fn'} ${printToString(parameterList)} ...)`, (params) => {
        let scopeParams = [[tokenType('recur'), functionEntity]]
        if (name) {
            scopeParams.push([name, functionEntity])
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
                    `<fn special form: ...spread parameter can only be at end of parameters list`
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
    })

    return functionEntity
}

export function functionMacro(argList, scope) {
    /*Converts: (function my-fn (...args)
     *            ...body)
     * to:      (set my-fn (fn (...args) ...body))
     */
    let fnName = first(argList)
    let fnBody = rest(argList)

    let fn = cons(tokenType('fn'), fnBody)

    return toList(tokenType('set'), fnName, fn)
}

export default [
    [tokenType('fn'), specialFormType('<fn special form>', fnSpecialForm)],
    [tokenType('function'), macroType('<function macro>', functionMacro)],
]
