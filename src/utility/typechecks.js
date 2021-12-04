import { listFirst, listGetAtIndex, listReduce, listRest } from '../types/list'
import { booleanType, functionType, tokenType, TYPE } from '../types/types'

function isType(params, type) {
    let param = listGetAtIndex(params, 0)

    return booleanType(param.type === type)
}

export default [
    ...Object.keys(TYPE).map((type) => [
        tokenType(`is-${type}`),
        functionType(`(is-${type} entity)`, (params) => {
            return isType(params, TYPE[type])
        }),
    ]),
    [
        tokenType('same-type'),
        functionType(`(same-type ...entities)`, (params) => {
            let first = listFirst(params)
            let rest = listRest(params)
            let ptr = rest.head

            while (ptr.type !== TYPE.null) {
                if (first.type !== ptr.value.type) {
                    return booleanType(false)
                }

                ptr = ptr.next
            }

            return booleanType(true)
        }),
    ],
]
