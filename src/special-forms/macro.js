import { assert } from '../assert'
import { runCode } from '../eval'
import { printToString } from '../logger'
import { createScope } from '../scope'
import { listAllOneType, promoteConsToList, cons, first, rest, toList } from '../types/list'
import { tokenType, specialFormType, functionType, nullType, listType, TYPE, macroType } from '../types/types'

// TODO should really share code with function.js since these do the same exact thing
function macroSpecialForm(argsList, creationScope) {
    let name = null
    let first = argsList.head
    if (TYPE.token === first.value.type) {
        name = first.value
        first = first.next
    }
    assert(TYPE.list === first.value.type, `<macro special form: must provide parameter list>`)

    let parameterList = first.value
    let bodyPtr = first.next
    assert(listAllOneType(parameterList, TYPE.token), `<macro special form: only tokens can be provided as parameters>`)

    let macroEntity = macroType(
        `(macro:${name ? name.value : 'anonymous'} ${printToString(parameterList)} ...)`,
        (params) => {
            let scopeParams = [[tokenType('recur'), macroEntity]]
            if (name && name.value !== 'recur') {
                scopeParams.push([name, macroEntity])
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
                        `<macro special form: ...spread parameter can only be at end of parameters list`
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

            let macroScope = createScope(scopeParams, creationScope)
            let body = bodyPtr
            let evalResult

            while (body.type !== TYPE.null) {
                evalResult = runCode(body.value, macroScope)

                body = body.next
            }

            return evalResult
        }
    )

    return macroEntity
}

function defMacroMacro(argList, scope) {
    /*Converts: (defmacro my-macro (...args)
     *            ...body)
     * to:      (set my-macro (macro (...args) ...body))
     */
    let macroName = first(argList)
    let macroBody = rest(argList)

    let macro = cons(tokenType('macro'), macroBody)

    return toList(tokenType('set'), macroName, macro)
}

export default [
    [tokenType('macro'), specialFormType('<macro special form>', macroSpecialForm)],
    [tokenType('defmacro'), macroType('<defmacro macro>', defMacroMacro)],
]
