import { functionType, tokenType, stringType, vectorType, TYPE } from '../types/types'
import { listFilter, listGetAtIndex, toList } from '../types/list'
import { vectorFilter } from '../types/vector'
import { assert } from '../assert'
import { isTruthy } from '../logic/booleans'
import { hashmapFilter } from '../types/hashmap'

function runFilter(fn, iterable) {
    const filterFn = (val, key) => isTruthy(fn.execute(toList(val, key, iterable)))

    switch (iterable.type) {
        case TYPE.list:
            return listFilter(iterable, filterFn)

        case TYPE.vector:
            return vectorFilter(iterable, filterFn)

        case TYPE.hashmap:
            return hashmapFilter(iterable, filterFn)

        case TYPE.string:
            // convert to vector of characters
            let vector = vectorType(iterable.value.split('').map((char) => stringType(char)))
            // apply filter
            let filtered = vectorFilter(vector, filterFn)
            // convert back to a string
            return stringType(filtered.value.map((char) => char.value).join(''))

        default:
            assert(false, `Second parameter to filter must be an iterable type`)
    }
}

function filterFunction(params) {
    let fn = listGetAtIndex(params, 0)
    let iterable = listGetAtIndex(params, 1)
    assert(fn.type === TYPE.function, `First parameter to filter must be a function`)

    if (iterable.type === TYPE.null) {
        return functionType(`(filter iterable)`, (params) => {
            let iterable = listGetAtIndex(params, 0)

            return runFilter(fn, iterable)
        })
    } else {
        return runFilter(fn, iterable)
    }
}

export default [
    [tokenType('filter'), functionType(`(filter fn iterable)`, filterFunction)],
    [tokenType('identity'), functionType(`(identity entity)`, (params) => listGetAtIndex(params, 0))],
]
