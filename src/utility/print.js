import { printToString } from '../logger'
import { listForEach } from '../types/list'
import { functionType, nullType, tokenType } from '../types/types'

export default [
    tokenType('print'),
    functionType(`(print ...args)`, (params) => {
        let output = ''
        listForEach(params, (param) => {
            output += printToString(param)
        })
        console.log(output)

        return nullType()
    }),
]
