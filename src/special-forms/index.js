import runnables from './runnables'
import ifForm from './if'
import letForm from './let'
import declareForm from './declare'
import updateForm from './update'
import quoteForm from './quote'
import moduleForm from './module'
import importForm from './import'
import doForm from './do'
import condForm from './cond'
import whileForm from './while'
import evalForm from './eval'
import backQuoteForms from './back-quote'

export default [
    ...runnables,
    ...backQuoteForms,
    ifForm,
    letForm,
    declareForm,
    updateForm,
    quoteForm,
    moduleForm,
    importForm,
    doForm,
    condForm,
    whileForm,
    evalForm,
]
