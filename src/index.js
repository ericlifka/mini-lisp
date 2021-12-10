import { startRepl } from './repl'
import { runTopLevelFile } from './loader'

export function cli(args) {
    let filename = args[2]

    if (filename) {
        runTopLevelFile(filename)
    } else {
        startRepl()
    }
}
