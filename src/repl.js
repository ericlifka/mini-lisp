import { log, printToString } from './logger';
import { parseString } from './parser';

export function parse(code) {
    return parseString(code)
}

export function evalulate(ast) {
    return ast
}

export function print(result) {
    log(printToString(result))
}

export function repl() {
    log('<mini-lisp>\ninitializing REPL\n')
    
    let input = parse(`(-201.345 ("eric" (3)) some-token ((4 5)))`)
    let result = evalulate(input)
    print(result)

    log('\nterminating REPL\n')
}