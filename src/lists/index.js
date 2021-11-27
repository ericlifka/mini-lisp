import { assert } from '../assert'
import { listGetAtIndex, listLength, promoteConsToList } from '../types/list'
import { consType, functionType, listType, nullType, numberType, tokenType, TYPE } from '../types/types'

function consfunctionForm(params) {
    let first = listGetAtIndex(params, 0)
    let second = listGetAtIndex(params, 1)

    if (second.type === TYPE.list) {
        return promoteConsToList(consType(first, second.head))
    } else if (second.type === TYPE.null) {
        return promoteConsToList(consType(first))
    } else {
        return consType(first, second)
    }
}

function firstFunctionForm(params) {
    let param = listGetAtIndex(params, 0)
    if (param.type === TYPE.list) {
        if (param.head.type === TYPE.null) {
            return nullType()
        }
        return param.head.value
    } else if (param.type === TYPE.cons) {
        return param.value
    } else if (param.type === TYPE.null) {
        return nullType()
    }

    assert(false, `(first) requires a list or list like entity`)
}

function restFunctionForm(params) {
    let param = listGetAtIndex(params, 0)
    if (param.type === TYPE.list) {
        if (param.head.type === TYPE.null) {
            return listType()
        }
        return promoteConsToList(param.head.next)
    } else if (param.type === TYPE.cons) {
        return param.next
    } else if (param.type === TYPE.null) {
        return listType()
    }

    assert(false, `(rest) requires a list or list like entity`)
}

function lengthFunctionForm(params) {
    let param = listGetAtIndex(params, 0)
    if (param.type === TYPE.list) {
        return numberType(listLength(param))
    } else if (param.type === TYPE.null) {
        return numberType(0)
    }

    assert(false, `(length) only works on lists`)
}

export default [
    [tokenType('list'), functionType(`(list ...)`, (params) => params)],
    [tokenType('cons'), functionType(`(cons entity list|null|entity)`, consfunctionForm)],
    [tokenType('first'), functionType(`(first list)`, firstFunctionForm)],
    [tokenType('rest'), functionType(`(rest list)`, restFunctionForm)],
    [tokenType('length'), functionType(`(length list)`, lengthFunctionForm)],
]
