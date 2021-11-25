import { booleanType, functionType, tokenType, TYPE } from '../types/types'
import { listGetAtIndex, listLength } from '../types/list'
import { assert } from '../assert'

function listEquals(list1, list2) {
    let count1 = listLength(list1)
    let count2 = listLength(list2)
    if (count1 !== count2) {
        return false
    }

    let ptr1 = list1.head
    let ptr2 = list2.head
    while (ptr1.type !== TYPE.null) {
        if (!deepEquals(ptr1.value, ptr2.value)) {
            return false
        }

        ptr1 = ptr1.next
        ptr2 = ptr2.next
    }

    return true
}

export function deepEquals(arg1, arg2) {
    if (arg1.type !== arg2.type) {
        return false
    }

    switch (arg1.type) {
        case TYPE.cons:
            return arg1 === arg2

        case TYPE.list:
            return listEquals(arg1, arg2)

        case TYPE.null:
            return true

        case TYPE.boolean:
        case TYPE.string:
        case TYPE.number:
        case TYPE.token:
            return arg1.value === arg2.value

        case TYPE.specialForm:
        case TYPE.function:
        case TYPE.macro:
            return arg1.execute === arg2.execute
    }
}

function equalsForm(params) {
    assert(
        listLength(params) === 2,
        `equals can only be invoked on 2 parameters`,
    )

    return booleanType(
        deepEquals(listGetAtIndex(params, 0), listGetAtIndex(params, 1)),
    )
}

export default [
    [tokenType('equal'), functionType(`(equal arg1 arg2)`, equalsForm)],
    [tokenType('=='), functionType(`(== arg1 arg2)`, equalsForm)],
]
