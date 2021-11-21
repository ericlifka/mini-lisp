import { parseString } from '../src/parser';
import { printToString } from "../src/logger";

// NOTE: This should switch to testing repl functions once the repl is more fleshed out
const repl = input => printToString(parseString(input))

test('empty list', () => {
    expect(repl("()")).toBe("()")
})

test('simple list', () => {
    expect(repl("(1 2 3)")).toBe("(1 2 3)")
})

test('nested list', () => {
    expect(repl("(1 (2 (3)))")).toBe("(1 (2 (3)))")
})

test('list in first position of list', () => {
    expect(repl("((1 2) 3)")).toBe("((1 2) 3)")
})

test('lists can have any type', () => {
    expect(repl('("abc" 123 -some-token-)')).toBe('("abc" 123 -some-token-)')
})

test('lists ignore whitespace', () => {
    expect(repl('( 123    "abc"  token )')).toBe('(123 "abc" token)')
})
