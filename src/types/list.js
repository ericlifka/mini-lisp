import { TYPE, consType, listType } from "./types";

export function addToList(list, value) {
    if (list.head.type === TYPE.null) {
        list.head = list.last = consType(value)
    }
    else {
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