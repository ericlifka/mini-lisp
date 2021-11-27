import { tokenType, nullType } from './types/types'
import specialForms from './special-forms'
import mathForms from './math'
import logicForms from './logic'
import listForms from './lists'

export default [
    [tokenType('modules'), {}], // this should be a hashmap type once that's supported

    ...specialForms,
    ...mathForms,
    ...logicForms,
    ...listForms,
]
