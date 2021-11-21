import { addToList } from './types/list';
import { listType, stringType, numberType, tokenType, TYPE } from './types/types';

const STATE = {
    ready: "ready",
    inString: "in-string",
    inNumber: "in-number",
    inToken: "in-token",
}

const stringOpeningChar = "\""
const numberChars = "0123456789."
const numberSignChars = "+-"
const symbolChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,/_-+?<>!@#$%^&*;:|"
const syntaxCloseChars = ")"

export function parseString(string) {
    let input = string.split('')
    let head = listType()
    let current = head
    let parents = [ ]
    let state = STATE.ready
    let position = 0
    let escapeFlag = false

    const shouldOpenList = ch => state === STATE.ready && ch === '('
    const shouldCloseList = ch => state === STATE.ready && ch === ')'

    const shouldOpenString = ch => state === STATE.ready && stringOpeningChar === ch
    const shouldCloseString = ch => state === STATE.inString && ch === stringOpeningChar && !escapeFlag
    const shouldContinueString = ch => state === STATE.inString
    
    const shouldOpenNumber = ch => 
        state === STATE.ready && ( 
            numberChars.indexOf(ch) !== -1 ||
            numberSignChars.indexOf(ch) && numberChars.indexOf(input[position + 1]) !== -1)
    const shouldCloseNumber = ch => state === STATE.inNumber && (/\s/.test(ch) || syntaxCloseChars.indexOf(ch) !== -1)
    const shouldContinueNumber = ch => state === STATE.inNumber

    const shouldOpenToken = ch => state === STATE.ready && symbolChars.indexOf(ch) !== -1 
    const shouldCloseToken = ch => state === STATE.inToken && (/\s/.test(ch) || syntaxCloseChars.indexOf(ch) !== -1)
    const shouldContinueToken = ch => state === STATE.inToken

    const newDataState = (cell, _state) => {
        addToList(current, cell)
        parents.push(current)
        current = cell
        state = _state
        return cell
    }

    const popState = () => {
        let lastCell = current
        current = parents.pop()
        state = STATE.ready
        return lastCell
    }

    while (position < input.length) {
        let ch = input[position]

        if (ch === '\\' && !escapeFlag) {
            escapeFlag = true
        }

        else if (shouldOpenList(ch)) {
            newDataState(listType(), STATE.ready)
        }
        else if (shouldOpenString(ch)) {
            newDataState(stringType(), STATE.inString)
        }
        else if (shouldOpenNumber(ch)) {
            newDataState(numberType(ch), STATE.inNumber)
        }
        else if (shouldOpenToken(ch)) {
            newDataState(tokenType(ch), STATE.inToken)
        }

        else if (shouldCloseString(ch)) {
            popState()
            if (shouldCloseList(ch)) {
                popState()
            }
        }
        else if (shouldCloseNumber(ch)) {
            let number = popState()
            number.value = parseFloat(number.value)
            if (shouldCloseList(ch)) {
                popState()
            }
        }
        else if (shouldCloseToken(ch)) {
            popState()
            if (shouldCloseList(ch)) {
                popState()
            }
        }
        else if (shouldCloseList(ch)) {
            popState()
        }

        else if (shouldContinueString(ch)) {
            current.value += ch
            escapeFlag = false
        }
        else if (shouldContinueNumber(ch)) {
            current.value += ch
        }
        else if (shouldContinueToken(ch)) {
            current.value += ch
        }

        position++
    }

    if (current && current.type === TYPE.number) {
        current.value = parseFloat(current.value)
    }

    return head.head.value
}
