import { assert } from './assert'
import { addToList } from './types/list'
import { listType, stringType, numberType, tokenType, TYPE } from './types/types'

const STATE = {
    ready: 'ready',
    needInput: 'need-input',
    exprReady: 'expr-ready',
    inString: 'in-string',
    inToken: 'in-token',
}

const symbolChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./_-+?<>!@#$%^&*:|'
const syntaxCloseChars = ')'

const shouldOpenList = (ch, reader) => reader.state === STATE.ready && ch === '('
const shouldCloseList = (ch, reader) => reader.state === STATE.ready && ch === ')'

const shouldOpenString = (ch, reader) => reader.state === STATE.ready && '"' === ch
const shouldCloseString = (ch, reader) => reader.state === STATE.inString && ch === '"' && !reader.escapeFlag
const shouldContinueString = (ch, reader) => reader.state === STATE.inString

const shouldOpenToken = (ch, reader) => reader.state === STATE.ready && symbolChars.indexOf(ch) !== -1
const shouldCloseToken = (ch, reader) =>
    reader.state === STATE.inToken && (/\s/.test(ch) || syntaxCloseChars.indexOf(ch) !== -1)
const shouldContinueToken = (ch, reader) => reader.state === STATE.inToken

const newDataState = (cell, _state, reader) => {
    addToList(reader.current, cell)

    if (reader.quoteFlag) {
        cell.__special_quote__ = true
        cell.__parent_cons__ = reader.current.last
        reader.quoteFlag = false
    }

    reader.parents.push(reader.current)
    reader.current = cell
    reader.state = _state
    return cell
}

const popState = (reader) => {
    let lastCell = reader.current
    checkForConversions(lastCell)
    checkForUnfinishedEscapeQuote(lastCell)

    reader.entitiesParsed++
    reader.current = reader.parents.pop()
    reader.state = STATE.ready

    return lastCell
}

const checkForConversions = (token) => {
    if (token.type === TYPE.token) {
        let num = Number(token.value)
        if (!isNaN(num)) {
            token.value = num
            token.type = TYPE.number
        } else if (token.value === 'true' || token.value === 'false') {
            token.value = token.value === 'true'
            token.type = TYPE.boolean
        } else if (token.value === 'null') {
            token.type = TYPE.null
            delete token.value
        }
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

    return cell
}

export function newReader(input) {
    let wrapper = listType()
    return {
        input: input.split(''), // should probably handle streams and or files as well, at some point
        head: wrapper,
        current: wrapper,
        parents: [],
        state: STATE.ready,
        position: 0,
        escapeFlag: false,
        quoteFlag: false,
        entitiesParsed: 0,
    }
}

export function addInput(input, reader) {
    assert(reader.state === STATE.needInput, `Reader not finished with prior input before new input assigned`)

    reader.input = input.split('')
    reader.position = 0
    reader.state = STATE.ready
}

export function getExpression(reader) {
    assert(reader.state === STATE.exprReady, `Can only get expression from reader when one is ready`)

    let finished = reader.head
    reader.current = reader.head = listType()
    reader.entitiesParsed = 0

    if (reader.position >= reader.input.length) {
        reader.state = STATE.needInput
    } else {
        reader.state = STATE.ready
    }

    return finished.head.value
}

export function stepReader(reader) {
    if (reader.state === STATE.needInput || reader.state === STATE.exprReady) {
        return reader.state
    }

    let ch = reader.input[reader.position]

    if (ch === "'" && reader.state === STATE.ready) {
        reader.quoteFlag = true
    } else if (ch === '\\' && !reader.escapeFlag) {
        reader.escapeFlag = true
    } else if (shouldOpenList(ch, reader)) {
        newDataState(listType(), STATE.ready, reader)
    } else if (shouldOpenString(ch, reader)) {
        newDataState(stringType(), STATE.inString, reader)
    } else if (shouldOpenToken(ch, reader)) {
        newDataState(tokenType(ch, reader), STATE.inToken, reader)
    } else if (shouldCloseString(ch, reader)) {
        popState(reader)
    } else if (shouldCloseToken(ch, reader)) {
        checkForConversions(popState(reader))

        if (shouldCloseList(ch, reader)) {
            popState(reader)
        }
    } else if (shouldCloseList(ch, reader)) {
        popState(reader)
    } else if (shouldContinueString(ch, reader)) {
        reader.current.value += ch
        reader.escapeFlag = false
    } else if (shouldContinueToken(ch, reader)) {
        reader.current.value += ch
    }

    reader.position++

    if (reader.current === reader.head && reader.entitiesParsed > 0) {
        reader.state = STATE.exprReady
    } else if (reader.position >= reader.input.length) {
        if (reader.current && reader.current.type === TYPE.token) {
            popState(reader)
        }

        if (reader.current === reader.head) {
            reader.state = STATE.exprReady
        } else {
            reader.state = STATE.needInput
        }
    }

    return reader.state
}

export function parseString(string) {
    let reader = newReader(string)

    while (true) {
        let state = stepReader(reader)

        if (state === STATE.exprReady) {
            let expr = getExpression(reader)
            assert(!!expr, `parser returned undefined when an expression was expected.`)
            return expr
        }

        assert(state !== STATE.needInput, `parseString expects whole expressions, doesn\'t support partial reads`)
    }
}

// export function parseString(string) {
//     let input = string.split('')
//     let head = listType()
//     let current = head
//     let parents = []
//     let state = STATE.ready
//     let position = 0
//     let escapeFlag = false
//     let quoteFlag = false

//     const shouldOpenList = (ch) => state === STATE.ready && ch === '('
//     const shouldCloseList = (ch) => state === STATE.ready && ch === ')'

//     const shouldOpenString = (ch) => state === STATE.ready && '"' === ch
//     const shouldCloseString = (ch) => state === STATE.inString && ch === '"' && !escapeFlag
//     const shouldContinueString = (ch) => state === STATE.inString

//     const shouldOpenToken = (ch) => state === STATE.ready && symbolChars.indexOf(ch) !== -1
//     const shouldCloseToken = (ch) => state === STATE.inToken && (/\s/.test(ch) || syntaxCloseChars.indexOf(ch) !== -1)
//     const shouldContinueToken = (ch) => state === STATE.inToken

//     const newDataState = (cell, _state) => {
//         addToList(current, cell)

//         if (quoteFlag) {
//             cell.__special_quote__ = true
//             cell.__parent_cons__ = current.last
//             quoteFlag = false
//         }

//         parents.push(current)
//         current = cell
//         state = _state
//         return cell
//     }

//     const popState = () => {
//         let lastCell = current
//         current = parents.pop()
//         state = STATE.ready

//         checkForUnfinishedEscapeQuote(lastCell)

//         return lastCell
//     }

//     const checkForConversions = (token) => {
//         let num = Number(token.value)
//         if (!isNaN(num)) {
//             token.value = num
//             token.type = TYPE.number
//         }
//         if (token.value === 'true' || token.value === 'false') {
//             token.value = token.value === 'true'
//             token.type = TYPE.boolean
//         }
//         return token
//     }

//     const checkForUnfinishedEscapeQuote = (cell) => {
//         if (cell.__special_quote__) {
//             let quote = listType()
//             addToList(quote, tokenType('quote'))
//             addToList(quote, cell)
//             cell.__parent_cons__.value = quote

//             delete cell.__special_quote__
//             delete cell.__parent_cons__
//         }
//     }

//     while (position < input.length) {
//         let ch = input[position]

//         if (ch === "'" && state === STATE.ready) {
//             quoteFlag = true
//         } else if (ch === '\\' && !escapeFlag) {
//             escapeFlag = true
//         } else if (shouldOpenList(ch)) {
//             newDataState(listType(), STATE.ready)
//         } else if (shouldOpenString(ch)) {
//             newDataState(stringType(), STATE.inString)
//         } else if (shouldOpenToken(ch)) {
//             newDataState(tokenType(ch), STATE.inToken)
//         } else if (shouldCloseString(ch)) {
//             popState()
//         } else if (shouldCloseToken(ch)) {
//             checkForConversions(popState())

//             if (shouldCloseList(ch)) {
//                 popState()
//             }
//         } else if (shouldCloseList(ch)) {
//             popState()
//         } else if (shouldContinueString(ch)) {
//             current.value += ch
//             escapeFlag = false
//         } else if (shouldContinueToken(ch)) {
//             current.value += ch
//         }

//         position++
//     }

//     if (current && current.type === TYPE.token) {
//         checkForConversions(current)
//     }

//     checkForUnfinishedEscapeQuote(current)

//     return head.head.value
// }
