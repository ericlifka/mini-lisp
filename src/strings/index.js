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
import { vectorFromList } from '../types/vector'

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
    if (vector.type === TYPE.list) {
        vector = vectorFromList(vector)
    }

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

function strAddForm(args) {
    return stringJoinForm(toList(stringType(''), args))
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

function isCapitalizedForm(args) {
    let str = listGetAtIndex(args, 0)
    assert(str.type === TYPE.string, `is-capitalized function only works on strings, got: ${str.type}`)

    let first = str.value[0]
    return booleanType(first === first.toLocaleUpperCase())
}

function capitalizeForm(args) {
    let str = listGetAtIndex(args, 0)
    assert(str.type === TYPE.string, `capitalize function only works on strings, got: ${str.type}`)

    let first = str.value[0].toLocaleUpperCase()
    let rest = str.value.slice(1)
    return stringType(first + rest)
}

function capitalizeAllForm(args) {
    let str = listGetAtIndex(args, 0)
    assert(str.type === TYPE.string, `capitalize-all function only works on strings, got: ${str.type}`)

    return stringType(str.value.toLocaleUpperCase())
}

export default [
    [tokenType('split'), functionType(`(split str|regex str)`, stringSplitForm)],
    [tokenType('join'), functionType(`(join str vector)`, stringJoinForm)],
    [tokenType('str-add'), functionType(`(str-add ...strings)`, strAddForm)],
    [tokenType('to-string'), functionType(`(to-string entity)`, toStringForm)],
    [tokenType('to-number'), functionType(`(to-number string)`, toNumberForm)],
    [tokenType('trim'), functionType(`(trim string)`, trimForm)],
    [tokenType('str-contains'), functionType(`(str-contains str1 str2)`, strContainsForm)],
    [tokenType('is-capitalized'), functionType(`(is-capitalized str)`, isCapitalizedForm)],
    [tokenType('capitalize'), functionType(`(capitalize str)`, capitalizeForm)],
    [tokenType('capitalize-all'), functionType(`(capitalize-all str)`, capitalizeAllForm)],
]
