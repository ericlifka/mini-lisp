import { log, printToString } from './logger'
import { parseString } from './parser'
import { runCode } from './eval'
import repl from 'repl'

export function parse(code) {
    return parseString(code)
}

export function evalulate(ast) {
    return runCode(ast)
}

export function print(result) {
    log(printToString(result))
}

export function start() {
    log('<mini-lisp>\ninitializing REPL\n')

    repl.start({
        prompt: '> ',
        eval: (input, context, filename, cb) => {
            let ast = parse(input)
            let result = evalulate(ast)
            let stringResult = printToString(result)

            cb(null, stringResult)
        },
    }).addListener('exit', () => log('\nterminating REPL\n'))
}
