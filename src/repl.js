import { log } from './logger.js';

export function parse(codeString) {
    return codeString
}

export function evalulate(ast) {
    return ast
}

export function print(result) {
    console.log(result)
}

export function repl() {
    log('<mini-lisp>\ninitializing REPL\n')
    
    let input = parse(`(1 2 3)`)
    let result = evalulate(input)
    print(result)

    log('\nterminating REPL\n')
}