import applyForm from './apply'
import backQuoteForms from './back-quote'
import condForm from './cond'
import declareForm from './declare'
import doForm from './do'
import evalForm from './eval'
import ifForm from './if'
import importForm from './import'
import letForm from './let'
import moduleForm from './module'
import quoteForm from './quote'
import runnables from './runnables'
import updateForm from './update'
import whileForm from './while'

export default [
    applyForm,
    ...backQuoteForms,
    condForm,
    declareForm,
    doForm,
    evalForm,
    ifForm,
    importForm,
    letForm,
    moduleForm,
    quoteForm,
    ...runnables,
    updateForm,
    whileForm,
]
