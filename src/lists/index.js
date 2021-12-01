import { assert } from '../assert'
import { listGetAtIndex, listLength, promoteConsToList, listMap, toList } from '../types/list'
import { consType, functionType, listType, nullType, numberType, tokenType, TYPE, vectorType } from '../types/types'
import mapForm from './map'
import reduceForm from './reduce'
import filterForm from './filter'

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
    } else if (param.type === TYPE.vector) {
        return param.value[0]
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
    } else if (param.type === TYPE.vector) {
        return vectorType(param.value.slice(1))
    }

    assert(false, `(rest) requires a list or list like entity`)
}

function lengthFunctionForm(params) {
    let param = listGetAtIndex(params, 0)
    if (param.type === TYPE.list) {
        return numberType(listLength(param))
    } else if (param.type === TYPE.null) {
        return numberType(0)
    } else if (param.type === TYPE.vector) {
        return numberType(param.value.length)
    }

    assert(false, `(length) only works on iterables`)
}

export function listGetForm(params) {
    let list = listGetAtIndex(params, 0)
    let key = listGetAtIndex(params, 1)

    assert(list.type === TYPE.list && key.type === TYPE.number, `list-get requires a list followed by an index`)

    return listGetAtIndex(list, key.value)
}

export default [
    [tokenType('list'), functionType(`(list ...)`, (params) => params)],
    [tokenType('cons'), functionType(`(cons entity list|null|entity)`, consfunctionForm)],
    [tokenType('first'), functionType(`(first list)`, firstFunctionForm)],
    [tokenType('rest'), functionType(`(rest list)`, restFunctionForm)],
    [tokenType('length'), functionType(`(length iterable)`, lengthFunctionForm)],
    [tokenType('list-get'), functionType(`(list-get list index)`, listGetForm)],
    mapForm,
    reduceForm,
    filterForm,
]
