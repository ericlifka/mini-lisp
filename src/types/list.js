import { TYPE, consType, listType, nullType } from './types'

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

    while (ptr.type !== TYPE.null) {
        addToList(newList, fn(ptr.value))
        ptr = ptr.next
    }

    return newList
}

export function promoteConsToList(cons) {
    let newList = listType()
    if (cons.type === TYPE.null) return newList

    let ptr = cons
    while (ptr.next.type !== TYPE.null) {
        ptr = ptr.next
    }

    newList.head = cons
    newList.last = ptr

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
