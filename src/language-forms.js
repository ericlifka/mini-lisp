import { tokenType } from './types/types'
import specialForms from './special-forms'
import logicForms from './logic'
import listForms from './lists'
import hashmapForms from './hashmaps'
import utilityForms from './utility'

export default [
    [tokenType('modules'), {}], // this should be a hashmap type once that's supported

    ...specialForms,
    ...logicForms,
    ...listForms,
    ...hashmapForms,
    ...utilityForms,
]
