import { assert } from '../assert'
import { first, listForEach, listGetAtIndex, rest, toList, listReduce } from '../types/list'
import { functionType, tokenType, TYPE } from '../types/types'

function reduceFunctionForm(params, scope) {
    let fn = listGetAtIndex(params, 0)
    let list = listGetAtIndex(params, 1)

    assert(fn.type === TYPE.function, `First parameter to reduce must be a function`)
    if (list.type === TYPE.null) {
        return functionType(`(reduce list)`, (params) => {
            return listReduce(listGetAtIndex(params, 0), (accum, elem, index) => {
                return fn.execute(toList(accum, elem, numberType(index), list))
            })
        })
    } else {
        return listReduce(list, (accum, elem, index) => {
            return fn.execute(toList(accum, elem, numberType(index), list))
        })
    }
}

export default [tokenType('reduce'), functionType(`(reduce fn list)`, reduceFunctionForm)]
