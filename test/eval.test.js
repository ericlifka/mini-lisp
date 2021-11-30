import { runCode } from '../src/eval'
import { printToString } from '../src/logger'
import { parseString } from '../src/parser'
import { createScope, getGlobalScope } from '../src/scope'
import { nullType, numberType, stringType, tokenType, TYPE } from '../src/types/types'
import { run } from './test-run-helper'

// describe('garbage', () => {
//     test('throws on unrecognized types', () => {
//         expect(() => runCode({ type: 'something-random' })).toThrow()
//     })
//     test('throws on executing a list without a function', () => {
//         expect(() => run('(1 2 3)')).toThrow()
//     })
// })

// describe('basic types', () => {
//     test('basic types evaluate to themselves', () => {
//         expect(run('1')).toBe('1')
//         expect(run('"abc"')).toBe('"abc"')
//         expect(run('null')).toBe('null')
//     })
// })

describe('tokens', () => {
    test('tokens are looked up in scope', () => {
        let scope = createScope([[tokenType('a'), numberType(5)]], getGlobalScope())
        expect(runCode(tokenType('a'), scope)).toEqual({
            type: TYPE.number,
            value: 5,
        })
    })
})
