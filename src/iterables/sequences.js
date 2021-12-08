import { assert } from '../assert'
import { arrayOfArguments } from '../destructuring'
import { isTruthy } from '../logic/booleans'
import { addToList } from '../types/list'
import { booleanType, functionType, listType, nullType, numberType, tokenType, TYPE } from '../types/types'

function sequenceForm(params) {
    let [start, stop, inc, inclusive] = arrayOfArguments(params, 4)
    let seq = listType()

    if (start.type === TYPE.null) {
        return seq
    }

    if (inc.type === TYPE.boolean) {
        inclusive = inc
        inc = nullType()
    }

    if (stop.type === TYPE.boolean) {
        inclusive = stop
        stop = nullType()
    }

    if (stop.type === TYPE.null) {
        stop = start
        start = numberType(0)
    }

    if (inc.type === TYPE.null) {
        inc = numberType(stop.value >= start.value ? 1 : -1)
    }

    assert(
        start.type === TYPE.number && stop.type === TYPE.number && inc.type === TYPE.number,
        `TypeError: All arguments to sequence expected to be numbers`
    )
    if (start.value === stop.value) {
        return seq
    }

    let isDone
    if (start.value < stop.value) {
        assert(inc.value > 0, `Sequence from ${start.value} to ${stop.value} by ${inc.value} will never terminate`)
        if (isTruthy(inclusive)) {
            isDone = (i) => i <= stop.value
        } else {
            isDone = (i) => i < stop.value
        }
    }
    if (start.value > stop.value) {
        assert(inc.value < 0, `Sequence from ${start.value} to ${stop.value} by ${inc.value} will never terminate`)
        if (isTruthy(inclusive)) {
            isDone = (i) => i >= stop.value
        } else {
            isDone = (i) => i > stop.value
        }
    }

    for (let i = start.value; isDone(i); i += inc.value) {
        addToList(seq, numberType(i))
    }

    return seq
}

export default [[tokenType('sequence'), functionType(`(sequence start stop inc)`, sequenceForm)]]
