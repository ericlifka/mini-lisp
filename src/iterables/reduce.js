import { assert } from '../assert'
import { hashmapReduce } from '../types/hashmap'
import { listGetAtIndex, toList, listReduce } from '../types/list'
import { functionType, tokenType, stringType, vectorType, TYPE } from '../types/types'
import { vectorReduce } from '../types/vector'
import { firstForm, restForm } from './getters'

function runReduce(fn, start, iterable) {
    assert(!(start.type === TYPE.null && iterable.type === TYPE.null), `TypeError: reduce must be supplied an iterable`)
    let firstProvided = true
    if (iterable.type === TYPE.null) {
        // move params around so that start and iterable are the right things
        iterable = restForm(toList(start))
        start = firstForm(toList(start))
        firstProvided = false
    }

    const reduceFn = (accum, val, key) => fn.execute(toList(accum, val, key, iterable))

    switch (iterable.type) {
        case TYPE.list:
            return listReduce(start, iterable, firstProvided, reduceFn)

        case TYPE.vector:
            return vectorReduce(start, iterable, firstProvided, reduceFn)

        case TYPE.hashmap:
            return hashmapReduce(start, iterable, firstProvided, reduceFn)

        case TYPE.string:
            // convert to vector of characters
            let vector = vectorType(iterable.value.split('').map((char) => stringType(char)))
            // apply reducer
            let result = vectorReduce(start, vector, firstProvided, reduceFn)
            // send back results
            return result

        default:
            assert(false, `TypeError: reduce must be supplied an iteratable type`)
    }
}

function reduceForm(params) {
    let fn = listGetAtIndex(params, 0)
    let start = listGetAtIndex(params, 1)
    let iterable = listGetAtIndex(params, 2)
    assert(fn.type === TYPE.function, `First parameter to reduce must be a function`)

    if (start.type === TYPE.null && iterable.type === TYPE.null) {
        return functionType(`(reduce start? iterable)`, (otherParams) => {
            let start = listGetAtIndex(otherParams, 0)
            let iterable = listGetAtIndex(otherParams, 1)

            return runReduce(fn, start, iterable)
        })
    } else {
        return runReduce(fn, start, iterable)
    }
}

export default [tokenType('reduce'), functionType(`(reduce fn start? iterable)`, reduceForm)]
