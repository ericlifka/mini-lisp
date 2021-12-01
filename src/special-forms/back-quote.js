import { listGetAtIndex, listMap } from '../types/list'
import { specialFormType, tokenType, TYPE } from '../types/types'
import { runCode } from '../eval'

const isUnquoteList = (list) => list.head.value.type === TYPE.token && list.head.value.value === 'unquote'

function backQuoteSpecialForm(params, scope) {
    function mapper(entity) {
        if (entity.type !== TYPE.list) {
            return entity
        } else if (isUnquoteList(entity)) {
            return runCode(entity, scope)
        } else {
            return listMap(entity, mapper)
        }
    }

    return listMap(listGetAtIndex(params, 0), mapper)
}

function unquoteSpecialForm(params, scope) {
    return runCode(listGetAtIndex(params, 0), scope)
}

export default [
    [tokenType('back-quote'), specialFormType(`(back-quote entity)`, backQuoteSpecialForm)],
    [tokenType('unquote'), specialFormType(`(unquote entity)`, unquoteSpecialForm)],
]
