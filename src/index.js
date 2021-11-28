import { startRepl } from './repl'
import { runFile } from './loader'
import { log } from './logger'

let filename = process.argv[2]

if (filename) {
    log('\n<μlisp>\n')
    runFile(filename)
    log('\n')
} else {
    startRepl()
}
