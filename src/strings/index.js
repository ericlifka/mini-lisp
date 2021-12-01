import { assert } from '../assert'
import { listGetAtIndex } from '../types/list'
import { functionType, stringType, tokenType, TYPE, vectorType } from '../types/types'

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

export default [[tokenType('split'), functionType(`(split str|regex str)`, stringSplitForm)]]
