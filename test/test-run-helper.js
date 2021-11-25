import { runCode } from "../src/eval"
import { printToString } from "../src/logger"
import { parseString } from "../src/parser"

export const run = input => 
    printToString(runCode(parseString(input)))
    
export const parse = input => 
    printToString(parseString(input))
