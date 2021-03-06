import fs from 'fs'
import path from 'path'
import { assert } from './assert'
import { runCode } from './eval'
import { checkExpressionReady, checkNeedsInput, getExpression, newReader, parseToNextBreak } from './parser'
import { newFileScope } from './scope'
import { TYPE } from './types/types'

let workingDir = ''

export function runTopLevelFile(filename) {
    workingDir = path.dirname(filename)
    runFile(filename)
}

export function runFile(filename) {
    const fileContents = fs.readFileSync(filename, 'utf8')
    const fileScope = newFileScope(filename)
    const reader = newReader(fileContents)

    while (!checkNeedsInput(reader)) {
        parseToNextBreak(reader)

        if (checkExpressionReady(reader)) {
            runCode(getExpression(reader), fileScope)
        }
    }
}

export function loadModule(module) {
    assert(module.type === TYPE.token, `Modules must be loaded by a token representing their file path`)

    const moduleName = path.join(workingDir, ...module.value.split('.')) + '.ulsp'

    runFile(moduleName)
}
