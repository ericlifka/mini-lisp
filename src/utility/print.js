import { printToString } from '../logger'
import { listForEach, listGetAtIndex } from '../types/list'
import { functionType, nullType, stringType, tokenType } from '../types/types'

export default [
    [
        tokenType('print'),
        functionType(`(print ...args)`, (params) => {
            let output = ''
            listForEach(params, (param) => {
                output += printToString(param)
            })
            console.log(output)

            return nullType()
        }),
    ],
    [
        tokenType('print-to-string'),
        functionType(`(print-to-string entity)`, (params) => stringType(printToString(listGetAtIndex(params, 0)))),
    ],
]
