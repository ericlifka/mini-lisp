import { TYPE, consType, numberType, tokenType, booleanType } from "../src/types/types";

describe("cons cells", () => {
    test("empty cons", () => {
        expect(consType()).toEqual({
            type: TYPE.cons,
            value: { type: TYPE.null },
            next: { type: TYPE.null }
        })
    })

    test("only a value", () => {
        expect(consType(numberType(5))).toEqual({
            type: TYPE.cons,
            value: { type: TYPE.number, value: 5 },
            next: { type: TYPE.null }
        })
    })

    test("only a next", () => {
        expect(consType(undefined, numberType(5))).toEqual({
            type: TYPE.cons,
            value: { type: TYPE.null },
            next: { type: TYPE.number, value: 5 }
        })
    })

    test("both a value and a next", () => {
        expect(consType(numberType(1), numberType(5))).toEqual({
            type: TYPE.cons,
            value: { type: TYPE.number, value: 1 },
            next: { type: TYPE.number, value: 5 }
        })
    })
})

describe('numbers', () => {
    test('defaults to zero', () => {
        expect(numberType()).toHaveProperty("value", 0)
    })
})

describe('tokens', () => {
    test('defaults to empty string', () => {
        expect(tokenType()).toHaveProperty("value", "")
    })
})

describe('booleans', () => {
    test('defaults to false', () => {
        expect(booleanType()).toHaveProperty("value", false)
    })
})
