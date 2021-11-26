import fnForms from './function'
import macroForms from './macro'
import ifForm from './if'
import letForm from './let'
import setForm from './set'
import updateForm from './update'
import quoteForm from './quote'
import moduleForm from './module'
import importForm from './import'

export default [...fnForms, ...macroForms, ifForm, letForm, setForm, updateForm, quoteForm, moduleForm, importForm]
