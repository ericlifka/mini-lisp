import { assert } from '../assert'
import { hashmapSort } from '../types/hashmap'
import { listGetAtIndex, listSort, toList } from '../types/list'
import { functionType, numberType, tokenType, TYPE } from '../types/types'
import { vectorSort } from '../types/vector'

function executeSort(fn, iterable) {
    const sorter = (...args) => {
        let result = fn.execute(toList(...args))

        if (result.type === TYPE.boolean) {
            return result.value ? 1 : -1
        }
        if (result.type === TYPE.number) {
            return result.value
        }

        assert(false, `TypeError: unexpected return type from sorter function: ${result.type}, ${result}`)
    }

    switch (iterable.type) {
        case TYPE.vector:
            return vectorSort(iterable, sorter)

        case TYPE.list:
            return listSort(iterable, sorter)

        case TYPE.hashmap:
            return hashmapSort(iterable, sorter)

        default:
            assert(false, `TypeError: sort can only work on iterable types`)
    }
}

function sortForm(params) {
    let sorter = listGetAtIndex(params, 0)
    let iterable = listGetAtIndex(params, 1)
    assert(sorter.type === TYPE.function, `TypeError: First parameter to sort must be a function`)

    if (iterable.type === TYPE.null) {
        return functionType(`(sort iterable)`, (params) => {
            let iterable = listGetAtIndex(params, 0)

            return executeSort(sorter, iterable)
        })
    } else {
        return executeSort(sorter, iterable)
    }
}

function sortAscendingForm(params) {
    let entity1 = listGetAtIndex(params, 0)
    let entity2 = listGetAtIndex(params, 1)

    assert(entity1.type === entity2.type, `TypeError: sort-ascending can only compare entities of the same type`)

    switch (entity1.type) {
        case TYPE.number:
            return numberType(entity1.value - entity2.value)

        case TYPE.string:
        case TYPE.token:
            return numberType(entity1.value.localeCompare(entity2.value))

        default:
            assert(false, `TypeError: sort-ascending doesn't know how to compare type ${entity1.type}`)
    }
}

function sortDescendingForm(params) {
    return numberType(-1 * sortAscendingForm(params).value)
}

export default [
    [tokenType('sort'), functionType(`(sort (fn (first second) -1|0|1) iterable)`, sortForm)],
    [tokenType('sort-ascending'), functionType(`(sort-ascending entity1 entity2)`, sortAscendingForm)],
    [tokenType('sort-descending'), functionType(`(sort-descending entity1 entity2)`, sortDescendingForm)],
]
