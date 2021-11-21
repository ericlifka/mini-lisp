import { TYPE, consType } from "./types";

export function addToList(list, value) {
    if (list.head.type === TYPE.null) {
        list.head = list.last = consType(value)
    }
    else {
        list.last.next = consType(value)
        list.last = list.last.next
    }
}
