import { tokenType, nullType } from "./types/types"
import specialForms from './special-forms'
import mathForms from './math'

export default [
    [tokenType('null'), nullType()],

    ...specialForms,
    ...mathForms,
]
