import { assert } from '../assert'
import { arrayOfArguments } from '../destructuring'
import { printToString } from '../logger'
import { listGetAtIndex, toList } from '../types/list'
import {
    booleanType,
    functionType,
    nullType,
    numberType,
    stringType,
    tokenType,
    TYPE,
    vectorType,
} from '../types/types'

function executeSplit(splitter, str) {
    assert(str.type === TYPE.string, `split: arguments must be strings`)
    let result = str.value.split(splitter.value)

    return vectorType(result.map((str) => stringType(str)))
}

function stringSplitForm(params) {
    let splitter = listGetAtIndex(params, 0)
    let str = listGetAtIndex(params, 1)

    assert(splitter.type === TYPE.string, `split: arguments must be strings`)
    if (str.type === TYPE.null) {
        return functionType(`(splitter str)`, (params) => {
            return executeSplit(splitter, listGetAtIndex(params, 0))
        })
    } else {
        return executeSplit(splitter, str)
    }
}

function executeJoin(joiner, vector) {
    return stringType(
        vector.value
            .map((elem) => toStringForm(toList(elem)))
            .map((elem) => elem.value)
            .join(joiner.value)
    )
}

function stringJoinForm(params) {
    let joiner = listGetAtIndex(params, 0)
    let vector = listGetAtIndex(params, 1)
    assert(joiner.type === TYPE.string, `join: first argument must be a string to join elements with`)

    if (vector.type === TYPE.null) {
        return functionType(`(join vector)`, (params) => {
            let vector = listGetAtIndex(params, 0)

            return executeJoin(joiner, vector)
        })
    } else {
        return executeJoin(joiner, vector)
    }
}

function toStringForm(params) {
    let entity = listGetAtIndex(params, 0)

    if (entity.type === TYPE.string) {
        return entity
    } else {
        return stringType(printToString(entity))
    }
}

function toNumberForm(params) {
    let string = listGetAtIndex(params, 0)
    assert(string.type === TYPE.string, `TypeError: to-number only operates on strings`)

    let num = Number(string.value)
    if (isNaN(num)) {
        return nullType()
    } else {
        return numberType(num)
    }
}

function trimForm(params) {
    let string = listGetAtIndex(params, 0)
    assert(string.type === TYPE.string, `TypeError: trim only operates on strings`)

    return stringType(string.value.trim())
}

function strContainsForm(params) {
    let [str1, str2] = arrayOfArguments(params, 2)
    assert(str1.type === TYPE.string && str2.type === TYPE.string, `TypeError: str-contains requires two strings`)

    return booleanType(str1.value.indexOf(str2.value) > -1)
}

export default [
    [tokenType('split'), functionType(`(split str|regex str)`, stringSplitForm)],
    [tokenType('join'), functionType(`(join str vector)`, stringJoinForm)],
    [tokenType('to-string'), functionType(`(to-string entity)`, toStringForm)],
    [tokenType('to-number'), functionType(`(to-number string)`, toNumberForm)],
    [tokenType('trim'), functionType(`(trim string)`, trimForm)],
    [tokenType('str-contains'), functionType(`(str-contains str1 str2)`, strContainsForm)],
]
