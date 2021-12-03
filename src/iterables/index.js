import buildForms from './builders'
import filterForm from './filter'
import getterForms from './getters'
import mapForm from './map'
import modifierForms from './modifiers'
import reduceForm from './reduce'
import setForm from './set'

export default [...buildForms, filterForm, ...getterForms, mapForm, ...modifierForms, reduceForm, setForm]
