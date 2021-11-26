import { printToString } from '../../src/logger'
import { parseString } from '../../src/parser'
import { listLength, listGetAtIndex, first, rest, cons, toList } from '../../src/types/list'
import { listType, nullType, numberType, TYPE } from '../../src/types/types'

describe('internal helpers', () => {
    test('listLength returns 0 for empty list', () => {
        expect(listLength(listType())).toBe(0)
    })

    test('listLength returns the length of thelist', () => {
        expect(listLength(parseString('(1 2 3 4)'))).toBe(4)
    })

    test('listGetAtIndex returns null for negative', () => {
        expect(listGetAtIndex(parseString('(1 2 3)'), -1)).toHaveProperty('type', TYPE.null)
    })

    test('listGetAtIndex lists are zero indexed', () => {
        expect(listGetAtIndex(parseString('(1 2 3)'), 0)).toHaveProperty('value', 1)
    })

    test('listGetAtIndex returns requested index', () => {
        expect(listGetAtIndex(parseString('(1 2 3)'), 2)).toHaveProperty('value', 3)
    })

    test('listGetAtIndex anything past end of list is null', () => {
        expect(listGetAtIndex(parseString('(1 2 3)'), 4)).toHaveProperty('type', TYPE.null)
    })

    test('first helper', () => {
        expect(first(parseString('(1 2 3)'))).toHaveProperty('value', 1)
        expect(first(parseString('()'))).toHaveProperty('type', TYPE.null)
        expect(() => first(nullType())).toThrow()
    })

    test('rest helper', () => {
        expect(printToString(rest(parseString('(1 2 3)')))).toBe('(2 3)')
        expect(printToString(rest(parseString('(1)')))).toBe('()')
        expect(printToString(rest(parseString('()')))).toBe('null')
        expect(() => rest(nullType())).toThrow()
    })

    test('cons helper', () => {
        expect(printToString(cons(numberType(1)))).toBe('(1)')
        expect(printToString(cons(numberType(1), parseString('(2 3)')))).toBe('(1 2 3)')
        expect(printToString(cons(numberType(1), numberType(2)))).toBe('(1, 2)')
    })

    test('toList helper', () => {
        expect(printToString(toList(numberType(1), numberType(2), numberType(3)))).toBe('(1 2 3)')
        expect(printToString(toList())).toBe('()')
    })
})
