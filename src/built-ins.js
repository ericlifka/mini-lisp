import { assert } from "./assert"
import { runCode } from "./eval"
import { printToString } from "./logger"
import { createScope } from "./scope"
import { onlyTokensInList, promoteConsToList } from "./types/list"
import { 
    tokenType as token,
    specialFormType as specialForm,
    functionType as fn,
    macroType as macro,
    consType as cons,
    nullType,
    TYPE,
    numberType,
    functionType,
    listType
} from "./types/types"

export const builtIns = [
    // Types
    [token('null'), nullType()],

    /* [ token('sym'), handler(function () {})] or something, idk yet */

    // Special Forms
    [token('fn'), specialForm('<fn special form>', (argsList, creationScope) => {
        let name = null
        let first = argsList.head
        if (TYPE.string === first.value.type) {
            name = first.value
            first = first.next
        }
        assert(TYPE.list === first.value.type, `<fn special form: must provide parameter list>`)

        let parameterList = first.value
        let bodyPtr = first.next
        assert(onlyTokensInList(parameterList), `<fn special form: only tokens can be provided as parameters, got ${JSON.stringify(parameterList, null, 2)}>`)
        
        let functionEntity = functionType(
            `(${name ? name.value : 'fn'} ${printToString(parameterList)} ...)`,
            function fnExecutor(params) {
                let scopeParams = [ [token('recur'), functionEntity] ]
                if (name) {
                    scopeParams.push([name, functionEntity])
                }

                let tokensPtr = parameterList.head
                let valuesPtr = params.head
                while (tokensPtr.type !== TYPE.null) {
                    let currentToken = tokensPtr.value
                    let value

                    if (currentToken.value.slice(0,3) === "...") { // this is a rest param
                        assert(tokensPtr.next.type === TYPE.null, 
                            `<fn special form: ...spread parameter can only be at end of parameters list`)

                        currentToken = token(currentToken.value.slice(3))
                        value = valuesPtr.type === TYPE.null
                                    ? listType()
                                    : promoteConsToList(valuesPtr)
                        
                        valuesPtr = nullType() // move pointer to end of list because all params have been consumed
                    }
                    else {
                        value = valuesPtr.type === TYPE.null
                                    ? nullType()
                                    : valuesPtr.value
                    }

                    scopeParams.push([ currentToken, value ])

                    tokensPtr = tokensPtr.next
                    if (valuesPtr.type !== TYPE.null) {
                        valuesPtr = valuesPtr.next
                    }
                }

                let functionScope = createScope(scopeParams, creationScope)
                let evalResult

                while (bodyPtr.type !== TYPE.null) {
                    evalResult = runCode(bodyPtr.value, functionScope)

                    bodyPtr = bodyPtr.next
                }

                return evalResult
            }
        )

        return functionEntity
    })],

    // Math
    [token('+'), fn("(fn + ...numbers)", params => {
        let val = 0
        let ptr = params.head
        while (ptr.type !== TYPE.null) {
            assert(ptr.value.type === TYPE.number, `Type error: + expected type number but got ${ptr.value.type}`)
            
            val += ptr.value.value
            ptr = ptr.next
        }
        return numberType(val)
    })],

    [token('++1'), macro("(macro ++1 arg)", argsList => {
        return promoteConsToList(cons(token('+'), cons(numberType(1), argsList.head)))
    })]
]
