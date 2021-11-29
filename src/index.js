import { startRepl } from './repl'
import { runFile } from './loader'
import { log } from './logger'

export function cli(args) {
    let filename = args[2]
    if (filename) {
        log('\n<μlisp>\n')
        runFile(filename)
        log('\n')
    } else {
        startRepl()
    }
}
