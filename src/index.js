import { startRepl } from './repl'
import { runTopLevelFile } from './loader'

export function cli(args) {
    let filename = args[2]

    if (filename) {
        console.log(`μ Lisp, running file: ${filename}\n`)
        let start = Date.now()

        runTopLevelFile(filename)

        let stop = Date.now()
        console.log(`\nProgram finished in ${(stop - start) / 1000} seconds`)
    } else {
        startRepl()
    }
}
