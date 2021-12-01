import { tokenType } from './types/types'
import specialForms from './special-forms'
import logicForms from './logic'
import listForms from './lists'
import hashmapForms from './hashmaps'
import vectorForms from './vectors'
import stringForms from './strings'
import utilityForms from './utility'

export default [
    [tokenType('modules'), {}], // this should be a hashmap type once that's supported

    ...specialForms,
    ...logicForms,
    ...listForms,
    ...hashmapForms,
    ...vectorForms,
    ...stringForms,
    ...utilityForms,
]
