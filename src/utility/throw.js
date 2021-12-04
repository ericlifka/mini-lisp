import { listFirst, listRest } from '../types/list'
import { functionType, tokenType } from '../types/types'

export default [
    tokenType('throw'),
    functionType(`(throw error-message ...details)`, (params) => {
        let message = listFirst(params)
        let details = listRest(params)

        throw { message, details }
    }),
]
