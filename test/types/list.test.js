import { parseString } from '../../src/parser'
import { listLength, listGetAtIndex } from '../../src/types/list'
import { listType, TYPE } from '../../src/types/types'

describe('internal helpers', () => {
    test('listLength returns 0 for empty list', () => {
        expect(listLength(listType())).toBe(0)
    })

    test('listLength returns the length of thelist', () => {
        expect(listLength(parseString('(1 2 3 4)'))).toBe(4)
    })

    test('listGetAtIndex returns null for negative', () => {
        expect(listGetAtIndex(parseString('(1 2 3)'), -1)).toHaveProperty(
            'type',
            TYPE.null,
        )
    })

    test('listGetAtIndex lists are zero indexed', () => {
        expect(listGetAtIndex(parseString('(1 2 3)'), 0)).toHaveProperty(
            'value',
            1,
        )
    })

    test('listGetAtIndex returns requested index', () => {
        expect(listGetAtIndex(parseString('(1 2 3)'), 2)).toHaveProperty(
            'value',
            3,
        )
    })

    test('listGetAtIndex anything past end of list is null', () => {
        expect(listGetAtIndex(parseString('(1 2 3)'), 4)).toHaveProperty(
            'type',
            TYPE.null,
        )
    })
})
