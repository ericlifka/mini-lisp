import { assert } from '../assert'
import { listGetForm } from '../lists'
import { listGetAtIndex } from '../types/list'
import { functionType, tokenType, TYPE } from '../types/types'
import { vectorGetForm } from '../vectors'
import { hashmapGetForm } from '../hashmaps'

function getForm(params) {
    let entity = listGetAtIndex(params, 0)

    if (entity.type === TYPE.list) {
        return listGetForm(params)
    }
    if (entity.type === TYPE.vector) {
        return vectorGetForm(params)
    }
    if (entity.type === TYPE.hashmap) {
        return hashmapGetForm(params)
    }

    assert(false, `TypeError: first parameter to get must be an indexable entity`)
}

export default [tokenType('get'), functionType(`(get entity key)`, getForm)]
