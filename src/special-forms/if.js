import { assert } from '../assert'
import { runCode } from '../eval'
import { listGetAtIndex, listLength } from '../types/list'
import { specialFormType, tokenType, TYPE } from '../types/types'
import { isTruthy } from '../logic/booleans'

export function ifSpecialForm(argsList, scope) {
    let boolCheck = listGetAtIndex(argsList, 0)
    let truePath = listGetAtIndex(argsList, 1)
    let falsePath = listGetAtIndex(argsList, 2)

    let bool = runCode(boolCheck, scope)
    return isTruthy(bool) ? runCode(truePath, scope) : runCode(falsePath, scope)
}

export default [tokenType('if'), specialFormType('<if special form>', ifSpecialForm)]
