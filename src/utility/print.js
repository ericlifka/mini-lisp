import { printToString } from '../logger'
import { listForEach, listGetAtIndex } from '../types/list'
import { functionType, nullType, stringType, tokenType, TYPE } from '../types/types'

export default [
    [
        tokenType('print'),
        functionType(`(print ...args)`, (params) => {
            let output = ''
            listForEach(params, (param) => {
                if (param.type === TYPE.string) {
                    output += param.value
                } else {
                    output += printToString(param)
                }
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
