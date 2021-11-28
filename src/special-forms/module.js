import { assert } from '../assert'
import { runCode } from '../eval'
import { createModule } from '../scope'
import { tokenType, specialFormType, TYPE, nullType } from '../types/types'

function moduleSpecialForm(argList, scope) {
    assert(argList.head.type === TYPE.cons, `Usage error: <module> needs at least one expression`)
    let moduleName = argList.head.value
    let module = createModule(moduleName, scope)
    let bodyPtr = argList.head.next
    let result = nullType()

    while (bodyPtr.type !== TYPE.null) {
        result = runCode(bodyPtr.value, module)

        bodyPtr = bodyPtr.next
    }

    return result
}

export default [tokenType('module'), specialFormType('<module special form>', moduleSpecialForm)]
