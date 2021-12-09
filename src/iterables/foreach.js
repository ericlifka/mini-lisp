import { assert } from '../assert'
import { listForEach, listGetAtIndex, toList } from '../types/list'
import { functionType, tokenType, stringType, vectorType, TYPE, nullType } from '../types/types'
import { vectorForEach } from '../types/vector'
import { hashmapForEach } from '../types/hashmap'

function runForeach(fn, iterable) {
    let foreachFn = (val, key) => fn.execute(toList(val, key, iterable))

    switch (iterable.type) {
        case TYPE.list:
            return listForEach(iterable, foreachFn)

        case TYPE.vector:
            return vectorForEach(iterable, foreachFn)

        case TYPE.hashmap:
            return hashmapForEach(iterable, foreachFn)

        case TYPE.string:
            // convert to vector of characters
            let vector = vectorType(iterable.value.split('').map((char) => stringType(char)))
            // run foreach
            vectorForEach(vector, foreachFn)

            return nullType()

        default:
            assert(false, `Second parameter to map must be an iteratable type`)
    }
}

function foreachFunctionForm(params) {
    let fn = listGetAtIndex(params, 0)
    let iterable = listGetAtIndex(params, 1)
    assert(fn.type === TYPE.function, `First parameter to foreach must be a function`)

    if (iterable.type === TYPE.null) {
        return functionType(`(foreach iterable)`, (params) => {
            let iterable = listGetAtIndex(params, 0)

            return runForeach(fn, iterable)
        })
    } else {
        return runForeach(fn, iterable)
    }
}

export default [tokenType('foreach'), functionType(`(foreach fn iterable)`, foreachFunctionForm)]
