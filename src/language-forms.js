import { tokenType, nullType } from './types/types'
import specialForms from './special-forms'
import mathForms from './math'
import logicForms from './logic'
import listForms from './lists'

export default [
    [tokenType('null'), nullType()],

    ...specialForms,
    ...mathForms,
    ...logicForms,
    ...listForms,
]
