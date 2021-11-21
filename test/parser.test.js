import { parseString } from '../src/parser.js';
import { TYPE } from '../src/types/types.js';

test('adds 1 + 2 to equal 3', () => {
    expect(parseString("1")).toEqual({
        type: TYPE.number,
        value: 1
    })
})
