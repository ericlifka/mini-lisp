import { assert } from '../assert'
import { TYPE, consType, listType, nullType } from './types'

export function first(list) {
    assert(list.type === TYPE.list, `<fn first> expected list, recieved ${list.type}`)
    if (list.head.type === TYPE.null) {
        return nullType()
    } else {
        return list.head.value
    }
}

export function rest(list) {
    assert(list.type === TYPE.list, `<fn rest> expected list, recieved ${list.type}`)
    if (list.head.type === TYPE.null) {
        return nullType()
    } else {
        return promoteConsToList(list.head.next)
    }
}

export function cons(entity, other = nullType()) {
    if (other.type === TYPE.null) {
        let cell = consType(entity)
        return promoteConsToList(cell)
    } else if (other.type === TYPE.list) {
        let cell = consType(entity, other.head)
        return promoteConsToList(cell)
    } else {
        return consType(entity, other)
    }
}

export function toList(...args) {
    let consPtr = nullType()
    for (let i = args.length - 1; i >= 0; i--) {
        consPtr = consType(args[i], consPtr)
    }
    return promoteConsToList(consPtr)
}

export function addToList(list, value) {
    // WARNING: must only ever be used on a list being constructed, either by the parser or by a function creating a new list copy
    if (list.head.type === TYPE.null) {
        list.head = list.last = consType(value)
    } else {
        list.last.next = consType(value)
        list.last = list.last.next
    }
}

export function mapList(list, fn) {
    let newList = listType()
    let ptr = list.head
    let i = 0

    while (ptr.type !== TYPE.null) {
        addToList(newList, fn(ptr.value, i++))
        ptr = ptr.next
    }

    return newList
}

export function listForEach(list, fn) {
    let ptr = list.head
    let i = 0

    while (ptr.type !== TYPE.null) {
        fn(ptr.value, i++)
        ptr = ptr.next
    }
}

export function listFilter(list, fn) {
    let newList = listType()
    let ptr = list.head
    let i = 0

    while (ptr.type !== TYPE.null) {
        if (fn(ptr.value, i++)) {
            addToList(newList, ptr.value)
        }
        ptr = ptr.next
    }

    return newList
}

export function promoteConsToList(cons) {
    let newList = listType()
    if (cons.type === TYPE.null) return newList

    newList.head = cons

    return newList
}

export function listLength(list) {
    let ptr = list.head
    let count = 0
    while (ptr.type !== TYPE.null) {
        count++
        ptr = ptr.next
    }
    return count
}

export function listAllOneType(list, type) {
    let ptr = list.head
    while (ptr.type !== TYPE.null) {
        if (ptr.value.type !== type) {
            return false
        }
        ptr = ptr.next
    }
    return true
}

export function listGetAtIndex(list, index) {
    if (index < 0) return nullType()

    let ptr = list.head
    let count = 0
    while (ptr.type !== TYPE.null) {
        if (count === index) {
            return ptr.value
        }

        count++
        ptr = ptr.next
    }

    return nullType()
}
