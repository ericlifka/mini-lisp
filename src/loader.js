import fs from 'fs'
import path from 'path'
import assert from './assert'
import { runCode } from './eval'
import { printToString } from './logger'
import { checkExpressionReady, checkNeedsInput, getExpression, newReader, parseToNextBreak } from './parser'
import { newFileScope } from './scope'
import { stringType, TYPE } from './types/types'

export function runFile(filename) {
    try {
        const fileContents = fs.readFileSync(filename, 'utf8')
        const fileScope = newFileScope(filename)
        const reader = newReader(fileContents)

        parseToNextBreak(reader)

        if (checkExpressionReady(reader)) {
            let expr = getExpression(reader)
            runCode(expr, fileScope)
        }
        // should really support more than one list structure per file when i'm not feeling lazy
        assert(checkNeedsInput(reader), `File Loader expects one complete list structure`)
    } catch (e) {
        // should probably be an error type once those exist
        printToString(stringType(`Error running file ${filename}: ${e}`))
    }
}

export function loadModule(module) {
    try {
        assert(module.type === TYPE.token, `Modules must be loaded by a token representing their file path`)
        const moduleName = module.value.split('.').join('/') + '.ulsp'
        console.log(`attempting to load and run module: ${moduleName}`)

        runFile(moduleName)
    } catch (e) {}
}
