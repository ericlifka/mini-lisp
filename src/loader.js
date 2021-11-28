import fs from 'fs'
import path from 'path'
import { assert } from './assert'
import { runCode } from './eval'
import { checkExpressionReady, checkNeedsInput, getExpression, newReader, parseToNextBreak } from './parser'
import { newFileScope } from './scope'
import { TYPE } from './types/types'

let workingDir = ''

export function runFile(filename) {
    workingDir = path.dirname(filename)

    const fileContents = fs.readFileSync(filename, 'utf8')
    const fileScope = newFileScope(filename)
    const reader = newReader(fileContents)

    parseToNextBreak(reader)

    if (checkExpressionReady(reader)) {
        let expr = getExpression(reader)
        runCode(expr, fileScope)
    }
    // should really support more than one list structure per file when i'm not feeling lazy
    else {
        assert(false, `File Loader expects one complete list structure`)
    }
}

export function loadModule(module) {
    assert(module.type === TYPE.token, `Modules must be loaded by a token representing their file path`)

    const moduleName = path.join(workingDir, ...module.value.split('.')) + '.ulsp'

    runFile(moduleName)
}
