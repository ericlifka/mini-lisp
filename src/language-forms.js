import { tokenType } from './types/types'
import specialForms from './special-forms'
import logicForms from './logic'
import iterableForms from './iterables'
import stringForms from './strings'
import utilityForms from './utility'

export default [
    [tokenType('modules'), {}], // this should be a hashmap type once that's supported

    ...specialForms,
    ...logicForms,
    ...iterableForms,
    ...stringForms,
    ...utilityForms,
]
