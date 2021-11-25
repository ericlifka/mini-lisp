import { assert } from "../assert"
import { runCode } from "../eval"
import { listGetAtIndex, listLength } from "../types/list"
import { tokenType, functionType, specialFormType, TYPE, booleanType } from "../types/types"

export const isFalsey = arg => 
       arg.type === TYPE.null 
    || arg.type === TYPE.boolean && arg.value === false
    || arg.type === TYPE.number && arg.value === 0
    || arg.type === TYPE.string && arg.value === ""
    || arg.type === TYPE.list && listLength(arg) === 0

export const isTruthy = arg => !isFalsey(arg)

function boolForm(params) {
    assert(listLength(params) === 1, `fn bool only takes 1 parameter`)

    let arg = listGetAtIndex(params, 0)

    return booleanType( isTruthy(arg) )
}

function notForm(params) {
    assert(listLength(params) === 1, `fn not only takes 1 parameter`)

    let arg = listGetAtIndex(params, 0)

    return booleanType( !isTruthy(arg) )
}

function andForm(argList, scope) {
    let count = listLength(argList)
    let result 

    for (let i = 0; i < count; i++) {
        let arg = listGetAtIndex(argList, i)
        result = runCode(arg, scope)

        if (isFalsey(result)) {
            return result
        }
    }

    return result
}

function orForm(argList, scope) {
    let count = listLength(argList)
    let result 

    for (let i = 0; i < count; i++) {
        let arg = listGetAtIndex(argList, i)
        result = runCode(arg, scope)

        if (isTruthy(result)) {
            return result
        }
    }

    return result
}

export default [
    [ tokenType('bool'), functionType(`(bool expr)`, boolForm) ],
    [ tokenType('not'), functionType(`(not expr)`, notForm) ],
    [ tokenType('and'), specialFormType(`(and expr1 expr2 ...)`, andForm) ],
    [ tokenType('or'), specialFormType(`(or expr1 expr2 ...)`, orForm) ],
]
