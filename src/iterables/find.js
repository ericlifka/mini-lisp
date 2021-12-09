import { functionType, tokenType, stringType, vectorType, TYPE } from '../types/types'
import { listFilter, listGetAtIndex, toList } from '../types/list'
import { vectorFind } from '../types/vector'
import { assert } from '../assert'
import { isTruthy } from '../logic/booleans'
import { hashmapFilter } from '../types/hashmap'

function runFind(fn, iterable) {
    const findFn = (val, key) => isTruthy(fn.execute(toList(val, key, iterable)))

    switch (iterable.type) {
        // TODO: implement other types for this
        // case TYPE.list:
        //     return listFilter(iterable, filterFn)

        case TYPE.vector:
            return vectorFind(iterable, findFn)

        // case TYPE.hashmap:
        //     return hashmapFilter(iterable, filterFn)

        // case TYPE.string:
        //     // convert to vector of characters
        //     let vector = vectorType(iterable.value.split('').map((char) => stringType(char)))
        //     // apply filter
        //     let filtered = vectorFilter(vector, filterFn)
        //     // convert back to a string
        //     return stringType(filtered.value.map((char) => char.value).join(''))

        default:
            assert(false, `Second parameter to find must be an iterable type`)
    }
}

function findFunction(params) {
    let fn = listGetAtIndex(params, 0)
    let iterable = listGetAtIndex(params, 1)
    assert(fn.type === TYPE.function, `First parameter to find must be a function`)

    if (iterable.type === TYPE.null) {
        return functionType(`(filter iterable)`, (params) => {
            let iterable = listGetAtIndex(params, 0)

            return runFind(fn, iterable)
        })
    } else {
        return runFind(fn, iterable)
    }
}

export default [tokenType('find'), functionType(`(find fn iterable)`, findFunction)]
