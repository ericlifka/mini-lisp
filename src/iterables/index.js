import buildForms from './builders'
import converterForms from './converters'
import filterForms from './filter'
import findForm from './find'
import foreachForm from './foreach'
import getterForms from './getters'
import mapForm from './map'
import modifierForms from './modifiers'
import reduceForm from './reduce'
import sequenceForms from './sequences'
import setForms from './set'
import sortForms from './sort'

export default [
    ...buildForms,
    ...converterForms,
    ...filterForms,
    findForm,
    foreachForm,
    ...getterForms,
    mapForm,
    ...modifierForms,
    reduceForm,
    ...sequenceForms,
    ...setForms,
    ...sortForms,
]
