import { log, printToString } from './logger'
import { parseString } from './parser'
import { runCode } from './eval'
import repl from 'repl'

export function start() {
    log('<mini-lisp>')

    repl.start({
        prompt: '> ',
        eval: (input, context, filename, cb) => {
            let ast = parseString(input)
            let result = runCode(ast)
            let stringResult = printToString(result)

            cb(null, stringResult)
        },
    }).addListener('exit', () => log('\nterminating REPL\n'))
}
