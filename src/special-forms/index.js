import applyForm from './apply'
import backQuoteForms from './back-quote'
import condForm from './cond'
import declareForm from './declare'
import doForm from './do'
import evalForm from './eval'
import ifForm from './if'
import importForm from './import'
import letForm from './let'
import loopForm from './loop'
import memoizeForms from './memoize'
import moduleForm from './module'
import quoteForm from './quote'
import runnables from './runnables'
import timeFnForm from './time-fn'
import updateForm from './update'

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
    loopForm,
    ...memoizeForms,
    moduleForm,
    quoteForm,
    ...runnables,
    timeFnForm,
    updateForm,
]
