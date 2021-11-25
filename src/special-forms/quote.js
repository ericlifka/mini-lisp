import { assert } from '../assert'
import { listGetAtIndex, listLength } from '../types/list'
import { specialFormType, tokenType } from '../types/types'

export function quoteForm(argList, scope) {
    assert(
        listLength(argList) === 1,
        `Malformed code error: too many parameters for special form quote`,
    )

    return listGetAtIndex(argList, 0)
}

export default [
    tokenType('quote'),
    specialFormType(`<quote special form>`, quoteForm),
]
