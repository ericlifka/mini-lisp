import { runCode } from '../src/eval'
import { printToString } from '../src/logger'
import { parseString } from '../src/parser'
import { getGlobalScope } from '../src/scope'

export const run = (input) => printToString(runCode(parseString(input)))

export const parse = (input) => printToString(parseString(input))

export function resetModules() {
    getGlobalScope().parent.tokens['modules'] = {}
}
