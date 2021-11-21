import { printToString } from "../src/logger";
import { numberType, stringType, tokenType } from "../src/types/types";

test('can print a number', () => {
    expect(printToString(numberType(5))).toEqual("5")
})

test('can print a string', () => {
    expect(printToString(stringType("abc"))).toEqual('"abc"')
})

test('can print a token', () => {
    expect(printToString(tokenType("-some-token-"))).toEqual('-some-token-')
})