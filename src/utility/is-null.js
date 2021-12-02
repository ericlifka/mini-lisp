import { listGetAtIndex } from '../types/list'
import { booleanType, functionType, tokenType, TYPE } from '../types/types'

export default [
    tokenType('is-null'),
    functionType(`(is-null entity)`, (params) => booleanType(listGetAtIndex(params, 0).type === TYPE.null)),
]
