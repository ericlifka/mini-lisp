import { assert } from './assert'
import { printToString } from './logger'
import { hashmapGet } from './types/hashmap'
import { listFirst, listRest, promoteConsToList } from './types/list'
import { nullType, tokenType, TYPE, vectorType } from './types/types'
import { vectorFromList } from './types/vector'

export function matchParameter(param, arg) {
    if (param.type === TYPE.token) {
        return [[param, arg]]
    }

    if (param.type === TYPE.list) {
        let indicator = listFirst(param)
        if (indicator.type === TYPE.token && indicator.value === 'hashmap') {
            return matchHashmap(param, arg)
        }

        if (indicator.type === TYPE.token && indicator.value === 'vector') {
            return matchVectorParameter(param, arg)
        }

        assert(
            arg.type === TYPE.list,
            `TypeError: Type mismatch trying to destructure list, recieved ${arg.type}:${printToString(arg)}`
        )
        return matchListParameter(param, arg)
    }

    assert(
        false,
        `ParamError: Encountered type in parameter list that couldn't be destructured: ${arg.type}:${printToString(
            param
        )}`
    )
}

function matchVectorParameter(paramsList, argsVector) {
    assert(
        argsVector.type === TYPE.vector,
        `TypeError: Trying to destructure vector, recieved ${argsVector.type}:${printToString(argsVector)}`
    )
    let paramsVector = vectorFromList(listRest(paramsList))
    let scopeValues = []

    for (let i = 0; i < paramsVector.value.length; i++) {
        let param = paramsVector.value[i]
        let arg = argsVector.value[i] || nullType()

        if (param.type === TYPE.token && param.value.slice(0, 3) === '...') {
            let argsRemaining = vectorType(argsVector.value.slice(i))
            let restParam = tokenType(param.value.slice(3)) // cut off '...' from token name

            scopeValues.push([restParam, argsRemaining])
            argsVector = vectorType([])
        } else {
            scopeValues = scopeValues.concat(matchParameter(param, arg))
        }
    }

    return scopeValues
}

function matchHashmap(paramsList, argsHashmap) {
    assert(
        argsHashmap.type === TYPE.hashmap,
        `TypeError: Trying to destructure hashmap, recieved ${argsHashmap.type}:${printToString(argsHashmap)}`
    )

    let paramsVector = vectorFromList(listRest(paramsList))
    let scopeValues = []

    for (let i = 0; i < paramsVector.value.length; i += 2) {
        let lookupKey = paramsVector.value[i]
        let assignKey = paramsVector.value[i + 1]
        assert(
            lookupKey &&
                assignKey &&
                (lookupKey.type === TYPE.token || lookupKey.type === TYPE.string || lookupKey.type === TYPE.number),
            `TypeError: Destructuring on hashmaps only works for keys of type token, string, or number`
        )
        let value = hashmapGet(argsHashmap, lookupKey)

        scopeValues = scopeValues.concat(matchParameter(assignKey, value))
    }

    return scopeValues
}

export function matchListParameter(paramsList, argsList) {
    let paramPtr = paramsList.head
    let argPtr = argsList.head
    let scopeValues = []

    while (paramPtr.type !== TYPE.null) {
        let param = paramPtr.value
        let arg = argPtr.type === TYPE.null ? nullType() : argPtr.value

        if (param.type === TYPE.token && param.value.slice(0, 3) === '...') {
            let argList = promoteConsToList(argPtr)
            let restParam = tokenType(param.value.slice(3)) // cut off '...' from token name

            scopeValues.push([restParam, argList])
            argPtr = nullType()
        } else {
            scopeValues = scopeValues.concat(matchParameter(param, arg))
        }

        paramPtr = paramPtr.next
        if (argPtr.type !== TYPE.null) {
            argPtr = argPtr.next
        }
    }

    return scopeValues
}

export function arrayOfArguments(argList, expected) {
    let toReturn = []
    let ptr = argList.head
    for (let i = 0; i < expected; i++) {
        if (ptr.type === TYPE.null) {
            toReturn.push(nullType())
        } else {
            toReturn.push(ptr.value)
            ptr = ptr.next
        }
    }
    return toReturn
}
