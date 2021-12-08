import buildForms from './builders'
import converterForms from './converters'
import filterForms from './filter'
import foreachForm from './foreach'
import getterForms from './getters'
import mapForm from './map'
import modifierForms from './modifiers'
import reduceForm from './reduce'
import sequenceForms from './sequences'
import setForm from './set'
import sortForms from './sort'

export default [
    ...buildForms,
    ...converterForms,
    ...filterForms,
    foreachForm,
    ...getterForms,
    mapForm,
    ...modifierForms,
    reduceForm,
    ...sequenceForms,
    setForm,
    ...sortForms,
]
