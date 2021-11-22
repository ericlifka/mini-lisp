import { TYPE } from "./types/types"

export const log = (...args) => {
    console.log(...args) // stub to make it easier to have a context aware logger later.
}

export const printToString = (cell) => {
    switch (cell.type) {
        case TYPE.null:
            return "null"

        case TYPE.string:
            return stringToString(cell)

        case TYPE.number: 
        case TYPE.token: 
            return `${cell.value}`

        case TYPE.cons:
            return `(${printToString(cell.value)}, ${printToString(cell.next)})`

        case TYPE.list:
            return listToString(cell)

        case TYPE.function:
        case TYPE.macro:
            return `${cell.doc}`
    }
}

const listToString = list => {
    if (list.head.type === TYPE.null) return "()"

    let ptr = list.head
    let printStr = "("

    while (ptr.next.type !== TYPE.null) {
        printStr += printToString(ptr.value) + " "
        ptr = ptr.next
    }

    printStr += printToString(ptr.value) + ")"

    return printStr
}

const stringToString = string =>
    `"${
        string.value
            .split('')
            .map( ch => ch === '"' ? `\\${ch}` : ch)
            .join('')
    }"`
