import buildForms from './builders'
import converterForms from './converters'
import filterForms from './filter'
import getterForms from './getters'
import mapForm from './map'
import modifierForms from './modifiers'
import reduceForm from './reduce'
import setForm from './set'
import sortForms from './sort'

export default [
    ...buildForms,
    ...converterForms,
    ...filterForms,
    ...getterForms,
    mapForm,
    ...modifierForms,
    reduceForm,
    setForm,
    ...sortForms,
]
