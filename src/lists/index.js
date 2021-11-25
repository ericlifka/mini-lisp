import { functionType, tokenType } from '../types/types'

export default [
    [tokenType('list'), functionType(`(list ...)`, (params) => params)],
]
