import printForms from './print'
import readForm from './read'
import throwForm from './throw'
import typecheckForms from './typechecks'

export default [...printForms, readForm, throwForm, ...typecheckForms]
