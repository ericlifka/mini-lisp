import { assert } from '../assert'
import { listGetAtIndex } from '../types/list'
import { functionType, nullType, tokenType, TYPE } from '../types/types'
import { vectorFromList } from '../types/vector'

function memoizeForm(args) {
    let fn = listGetAtIndex(args, 0)
    assert(fn.type === TYPE.function, `Memoize can only work on functions`)

    let cache = {}

    let callable = functionType(`(memoized fn ...)`, (args) => {
        let calledWith = vectorFromList(args).value
        let cacheKey = '{' + calledWith.map((entity) => entity.value).join('}|{') + '}'
        if (cache.hasOwnProperty(cacheKey)) {
            cache[cacheKey].called++
            return cache[cacheKey].result
        } else {
            // let len = calledWith[1].value.length
            // let n = calledWith[0].value
            // // if (len > 2) {
            // //     console.log(`cache miss: n:${n}, length:${len}`)
            // // }
            let result = fn.execute(args)
            cache[cacheKey] = {
                called: 0,
                result,
            }
            return result
        }
    })

    callable.__cache__ = cache

    return callable
}

function printMemoCacheForm(args) {
    let fn = listGetAtIndex(args, 0)
    assert(fn.__cache__, `print-memo-cache - must pass a memoized fn`)
    console.log('memoize cache {')

    let cache = fn.__cache__
    Object.keys(cache)
        .sort((one, two) => cache[one].called - cache[two].called)
        .forEach((key) => {
            let { called, result } = cache[key]
            console.log(`  ${called} - ${key}: ${result.value}`)
        })
    console.log('}\n\n')

    return nullType()
}

export default [
    [tokenType('memoize'), functionType(`(memoize fn) -> fn`, memoizeForm)],
    [tokenType('print-memo-cache'), functionType(``, printMemoCacheForm)],
]
