import { addToList } from './types/list';
import { listType, stringType, numberType, tokenType, TYPE } from './types/types';

const STATE = {
    ready: "ready",
    inString: "in-string",
    inNumber: "in-number",
    inToken: "in-token",
}

const symbolChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./_-+?<>!@#$%^&*:|"
const syntaxCloseChars = ")"

export function parseString(string) {
    let input = string.split('')
    let head = listType()
    let current = head
    let parents = [ ]
    let state = STATE.ready
    let position = 0
    let escapeFlag = false
    let quoteFlag = false

    const shouldOpenList = ch => state === STATE.ready && ch === '('
    const shouldCloseList = ch => state === STATE.ready && ch === ')'

    const shouldOpenString = ch => state === STATE.ready && '"' === ch
    const shouldCloseString = ch => state === STATE.inString && ch === '"' && !escapeFlag
    const shouldContinueString = ch => state === STATE.inString

    const shouldOpenToken = ch => state === STATE.ready && symbolChars.indexOf(ch) !== -1 
    const shouldCloseToken = ch => state === STATE.inToken && (/\s/.test(ch) || syntaxCloseChars.indexOf(ch) !== -1)
    const shouldContinueToken = ch => state === STATE.inToken

    const newDataState = (cell, _state) => {
        addToList(current, cell)

        if (quoteFlag) {
            cell.__special_quote__ = true
            cell.__parent_cons__ = current.last
            quoteFlag = false
        }
        
        parents.push(current)
        current = cell
        state = _state
        return cell
    }

    const popState = () => {
        let lastCell = current
        current = parents.pop()
        state = STATE.ready

        checkForUnfinishedEscapeQuote(lastCell)

        return lastCell
    }

    const checkForConversions = (token) => {
        let num = Number(token.value)
        if (!isNaN(num)) {
            token.value = num
            token.type = TYPE.number
        }
        if (token.value === "true" || token.value === "false") {
            token.value = token.value === "true"
            token.type = TYPE.boolean
        }
        return token
    }

    const checkForUnfinishedEscapeQuote = (cell) => {
        if (cell.__special_quote__) {
            let quote = listType()
            addToList(quote, tokenType('quote'))
            addToList(quote, cell)
            cell.__parent_cons__.value = quote

            delete cell.__special_quote__
            delete cell.__parent_cons__
        }
    }

    while (position < input.length) {
        let ch = input[position]

        if (ch === "'" && state === STATE.ready) {
            quoteFlag = true
        }
        else if (ch === '\\' && !escapeFlag) {
            escapeFlag = true
        }

        else if (shouldOpenList(ch)) {
            newDataState(listType(), STATE.ready)
        }
        else if (shouldOpenString(ch)) {
            newDataState(stringType(), STATE.inString)
        }
        else if (shouldOpenToken(ch)) {
            newDataState(tokenType(ch), STATE.inToken)
        }

        else if (shouldCloseString(ch)) {
            popState()
        }
        else if (shouldCloseToken(ch)) {
            checkForConversions(popState())

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
        else if (shouldContinueToken(ch)) {
            current.value += ch
        }

        position++
    }

    if (current && current.type === TYPE.token) {
        checkForConversions(current)
    }

    checkForUnfinishedEscapeQuote(current)

    return head.head.value
}
