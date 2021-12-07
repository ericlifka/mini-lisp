import { assert } from './assert'
import { printToString } from './logger'
import { hashmapForEach, hashmapGet } from './types/hashmap'
import { addToList, listFirst, listFromVector, listRest, promoteConsToList } from './types/list'
import { listType, nullType, TYPE } from './types/types'
import { vectorFromList } from './types/vector'

export function matchParameter(param, arg) {
    console.log('matchParameter', param, arg)

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

    return matchListParameter(listRest(paramsList), listFromVector(argsVector))
}

function matchHashmap(paramsList, argsHashmap) {
    assert(
        argsHashmap.type === TYPE.hashmap,
        `TypeError: Trying to destructure hashmap, recieved ${argsHashmap.type}:${printToString(argsHashmap)}`
    )

    let params = vectorFromList(listRest(paramsList)).value
    let lvals = listType()
    let rvals = listType()

    for (let i = 0; i < params.length; i += 2) {
        let lookupKey = params[i]
        let assignKey = params[i + 1]
        assert(
            lookupKey && assignKey && lookupKey.type === TYPE.token && assignKey.type === TYPE.token,
            `TypeError: Destructuring on hashmaps only works for keys of Token type`
        )

        let value = hashmapGet(argsHashmap, lookupKey)

        addToList(lvals, assignKey)
        addToList(rvals, value)
    }

    return matchListParameter(lvals, rvals)
}

export function matchListParameter(paramsList, argsList) {
    console.log('matchListParameter', paramsList, argsList)
    let paramPtr = paramsList.head
    let argPtr = argsList.head
    let scopeValues = []

    while (paramPtr.type !== TYPE.null) {
        let param = paramPtr.value
        let arg = argPtr.type === TYPE.null ? nullType() : argPtr.value

        if (param.type === TYPE.token && param.value.slice(0, 3) === '...') {
            param.value = param.value.slice(3) // cut off '...' from token name
            scopeValues.push([param, promoteConsToList(argPtr)])
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
