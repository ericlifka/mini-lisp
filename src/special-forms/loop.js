/*
goals for this special form:

(loop :for ((i 1) (< i 20) (inc i))
  statement1
  statement2
  ...)

(loop :while (something-true)
  statement1
  statement2
  ...)

(loop :let (i :in (some-collection)) ...)
(loop :let (i :of (some-collection)) ...)
(loop :let ((key val) :in (some-collection)) ...)

*/

import { assert } from '../assert'
import { arrayOfArguments } from '../destructuring'
import { runCode } from '../eval'
import { createScope, setOnScope } from '../scope'
import { hashmapGet } from '../types/hashmap'
import { addToList, cons, listFirst, listGetAtIndex, listRest } from '../types/list'
import { functionType, listType, numberType, specialFormType, tokenType, TYPE } from '../types/types'
import { vectorFromList } from '../types/vector'

function runForLoop(special, body, scope) {}
function runWhileLoop(special, body, scope) {}

function runInLoop(special, body, scope) {
    let [tokens, _in, collectionStmnt] = arrayOfArguments(special, 3)
    let collection = runCode(collectionStmnt, scope)
    let key, val
    if (tokens.type === TYPE.list) {
        key = listGetAtIndex(tokens, 0)
        val = listGetAtIndex(tokens, 1)
    } else if (_in.value === ':in') {
        val = tokens
    } else if (_in.value === ':of') {
        key = tokens
    } else {
        assert(false, `:let loop invalid format of special list`)
    }

    let collectionArray
    if (collection.type === TYPE.vector) {
        collectionArray = collection.value
    } else if (collection.type === TYPE.list) {
        collectionArray = vectorFromList(collection).value
    } else if (collection.type === TYPE.hashmap) {
        collectionArray = collection.keys
    }

    let result = listType()
    let loopScope = createScope(
        [
            [
                tokenType('collect'),
                functionType(`(collect entity)`, (args) => {
                    addToList(result, listGetAtIndex(args, 0))
                }),
            ],
        ],
        scope
    )

    for (let i = 0; i < collectionArray.length; i++) {
        let k = numberType(i)
        let v = collectionArray[i]
        if (collection.type === TYPE.hashmap) {
            k = v
            v = hashmapGet(collection, k)
        }
        key && setOnScope(loopScope, key, k)
        val && setOnScope(loopScope, val, v)

        runCode(body, loopScope)
    }

    return result
}

function loopSpecialForm(code, scope) {
    let key = listFirst(code)
    let loopSpecial = listFirst(listRest(code))
    let loopBody = cons(tokenType('do'), listRest(listRest(code)))

    switch (key.value) {
        case ':for':
            return runForLoop(loopSpecial, loopBody, scope)

        case ':while':
            return runWhileLoop(loopSpecial, loopBody, scope)

        case ':let':
            return runInLoop(loopSpecial, loopBody, scope)

        default:
            assert(false, `Invalid looping type: ${key.type}|${key.value}`)
    }
}

export default [tokenType('loop'), specialFormType(`<loop special form>`, loopSpecialForm)]
