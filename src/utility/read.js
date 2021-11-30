import { assert } from '../assert'
import { parseString } from '../parser'
import { listGetAtIndex } from '../types/list'
import { functionType, tokenType, TYPE } from '../types/types'

export default [
    tokenType('read'),
    functionType(`(read string)`, (params) => {
        let input = listGetAtIndex(params, 0)
        assert(input.type === TYPE.string, `Error: read only takes strings as input`)

        return parseString(input.value)
    }),
]
