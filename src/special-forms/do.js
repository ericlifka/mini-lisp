import { runCode } from '../eval'
import { nullType, specialFormType, tokenType, TYPE } from '../types/types'

function doSpecialForm(params, scope) {
    let ptr = params.head
    let result = nullType()
    while (ptr.type !== TYPE.null) {
        result = runCode(ptr.value, scope)
        ptr = ptr.next
    }
    return result
}

export default [tokenType('do'), specialFormType('(do ...)', doSpecialForm)]
