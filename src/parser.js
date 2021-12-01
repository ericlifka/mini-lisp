import { assert } from './assert'
import { hashmapSet } from './types/hashmap'
import { addToList } from './types/list'
import { listType, stringType, tokenType, TYPE, nullType } from './types/types'

const STATE = {
    ready: 'ready',
    needInput: 'need-input',
    exprReady: 'expr-ready',
    inString: 'in-string',
    inToken: 'in-token',
    inComment: 'in-comment',
}

const symbolChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./_-+=?<>!@#$%^&*:|'
const syntaxCloseChars = ')]}'
const specialEscapeChars = {
    b: '\b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t',
    v: '\v',
}
const quoteMap = {
    "'": 'quote',
    '`': 'back-quote',
    ',': 'unquote',
    '~': 'unquote',
}
const quoteChars = Object.keys(quoteMap)

const shouldOpenComment = (ch, reader) => reader.state !== STATE.inString && ch === ';'
const shouldCloseComment = (ch, reader) => reader.state === STATE.inComment && ch === '\n'

const shouldStartQuote = (ch, reader) => reader.state === STATE.ready && quoteChars.indexOf(ch) !== -1
const shouldStartEscape = (ch, reader) => ch === '\\' && !reader.escapeFlag

const shouldOpenList = (ch, reader) => reader.state === STATE.ready && ch === '('
const shouldCloseList = (ch, reader) => reader.state === STATE.ready && ch === ')'

const shouldOpenVector = (ch, reader) => reader.state === STATE.ready && ch === '['
const shouldCloseVector = (ch, reader) => reader.state === STATE.ready && ch === ']'

const shouldOpenHashmap = (ch, reader) => reader.state === STATE.ready && ch === '{'
const shouldCloseHashmap = (ch, reader) => reader.state === STATE.ready && ch === '}'

const shouldOpenString = (ch, reader) => reader.state === STATE.ready && '"' === ch
const shouldCloseString = (ch, reader) => reader.state === STATE.inString && ch === '"' && !reader.escapeFlag
const shouldContinueString = (ch, reader) => reader.state === STATE.inString

const shouldOpenToken = (ch, reader) => reader.state === STATE.ready && symbolChars.indexOf(ch) !== -1
const shouldCloseToken = (ch, reader) =>
    reader.state === STATE.inToken && (/\s/.test(ch) || syntaxCloseChars.indexOf(ch) !== -1)
const shouldContinueToken = (ch, reader) => reader.state === STATE.inToken

const addToCurrent = (current, cell) => {
    if (current.type === TYPE.list) {
        addToList(current, cell)
    }
    if (current.type === TYPE.vector) {
        current.value.push(cell)
    }
    if (current.type === TYPE.hashmap) {
        current.keys.push(cell)
    }
}

const newDataState = (cell, _state, reader) => {
    addToCurrent(reader.current, cell)

    if (reader.quoteFlag) {
        cell.__special_quote__ = quoteMap[reader.quoteFlag]
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

const checkForConversions = (entity) => {
    if (entity.type === TYPE.token) {
        let num = Number(entity.value)
        if (!isNaN(num)) {
            entity.value = num
            entity.type = TYPE.number
        } else if (entity.value === 'true' || entity.value === 'false') {
            entity.value = entity.value === 'true'
            entity.type = TYPE.boolean
        } else if (entity.value === 'null') {
            entity.type = TYPE.null
            delete entity.value
        }
    } else if (entity.type === TYPE.hashmap) {
        let pairs = entity.keys
        entity.keys = []

        for (let i = 0; i < pairs.length; i += 2) {
            let key = pairs[i]
            let value = pairs[i + 1] || nullType()

            hashmapSet(entity, key, value)
        }
    }

    return entity
}

const checkForUnfinishedEscapeQuote = (cell) => {
    if (cell.__special_quote__) {
        let quote = listType()
        addToList(quote, tokenType(cell.__special_quote__))
        addToList(quote, cell)
        cell.__parent_cons__.value = quote

        delete cell.__special_quote__
        delete cell.__parent_cons__
    }

    return cell
}

const hashmapBuilderType = () => {
    let list = listType()
    addToList(list, tokenType('hashmap'))
    return list
}

const vectorBuilderType = () => {
    let list = listType()
    addToList(list, tokenType('vector'))
    return list
}

export function newReader(input = '') {
    let wrapper = listType()
    return {
        input: input.split(''), // should probably handle streams and or files as well, at some point
        head: wrapper,
        current: wrapper,
        parents: [],
        state: input === '' ? STATE.needInput : STATE.ready,
        position: 0,
        escapeFlag: false,
        quoteFlag: false,
        entitiesParsed: 0,
    }
}

export function stepReader(reader) {
    if (reader.state === STATE.needInput || reader.state === STATE.exprReady) {
        return false
    }

    let ch = reader.input[reader.position]

    if (shouldOpenComment(ch, reader)) {
        reader.state = STATE.inComment
    } else if (shouldStartQuote(ch, reader)) {
        reader.quoteFlag = ch
    } else if (shouldStartEscape(ch, reader)) {
        reader.escapeFlag = true
    } else if (shouldOpenList(ch, reader)) {
        newDataState(listType(), STATE.ready, reader)
    } else if (shouldOpenVector(ch, reader)) {
        newDataState(vectorBuilderType(), STATE.ready, reader)
    } else if (shouldOpenHashmap(ch, reader)) {
        newDataState(hashmapBuilderType(), STATE.ready, reader)
    } else if (shouldOpenString(ch, reader)) {
        newDataState(stringType(), STATE.inString, reader)
    } else if (shouldOpenToken(ch, reader)) {
        newDataState(tokenType(ch, reader), STATE.inToken, reader)
    } else if (shouldCloseComment(ch, reader)) {
        reader.state = STATE.ready
    } else if (shouldCloseString(ch, reader)) {
        popState(reader)
    } else if (shouldCloseToken(ch, reader)) {
        checkForConversions(popState(reader))

        if (shouldCloseList(ch, reader) || shouldCloseVector(ch, reader) || shouldCloseHashmap(ch, reader)) {
            popState(reader)
        }
    } else if (shouldCloseList(ch, reader)) {
        popState(reader)
    } else if (shouldCloseVector(ch, reader)) {
        popState(reader)
    } else if (shouldCloseHashmap(ch, reader)) {
        popState(reader)
    } else if (shouldContinueString(ch, reader)) {
        if (reader.escapeFlag) {
            reader.current.value += specialEscapeChars[ch] || ch
            reader.escapeFlag = false
        } else {
            reader.current.value += ch
        }
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

        reader.state = STATE.needInput
    }

    return reader.state !== STATE.needInput && reader.state !== STATE.exprReady
}

export function checkNeedsInput(reader) {
    return reader.state === STATE.needInput
}

export function checkExpressionReady(reader) {
    return reader.state === STATE.exprReady
}

export function addInput(input, reader) {
    assert(reader.state === STATE.needInput, `Reader not finished: ${reader.input.length}, ${reader.position}`)

    reader.input = input.split('')
    reader.position = 0
    reader.state = input.length === '' ? STATE.needInput : STATE.ready
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

export function parseString(string) {
    let reader = newReader(string)
    let shouldContinue
    do {
        shouldContinue = stepReader(reader)
    } while (shouldContinue)

    if (checkExpressionReady(reader)) {
        let expr = getExpression(reader)
        assert(!!expr, `parser returned undefined when an expression was expected.`)
        return expr
    }

    assert(!checkNeedsInput(), `parseString expects whole expressions, doesn\'t support partial reads`)
}

export function parseToNextBreak(reader) {
    let shouldContinue = true
    while (shouldContinue) {
        shouldContinue = stepReader(reader)
    }
}
