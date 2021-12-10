import { arrayOfArguments } from '../destructuring'
import { printToString } from '../logger'
import { toList } from '../types/list'
import { functionType, tokenType, TYPE } from '../types/types'

function flabel(str) {
    while (str.length < 20) {
        str += ' '
    }
    return str.slice(0, 20)
}

function fnum(n) {
    let str = `${n}`
    while (str.length < 5) {
        str += '0'
    }
    return str.slice(0, 5) + 's'
}

function timeExecutionForm(params) {
    let [timedFunction] = arrayOfArguments(params, 1)
    let startTime = Date.now()
    let checkpoint = startTime
    let count = 1

    console.log('\ntime-function - tracking started\n')

    let result = timedFunction.execute(
        toList(
            functionType(`(checkpoint)`, (param) => {
                let [tag] = arrayOfArguments(param, 1)
                let label = tag.type === TYPE.null ? count : printToString(tag)
                let newCheckpoint = Date.now()
                let ctime = (newCheckpoint - checkpoint) / 1000
                let ttime = (newCheckpoint - startTime) / 1000

                console.log(`  checkpoint ${flabel(label)} | ${fnum(ctime)} elapsed | ${fnum(ttime)} total |`)
                checkpoint = newCheckpoint
                count++
            })
        )
    )

    let finishTime = Date.now()
    let ctime = (finishTime - checkpoint) / 1000
    let ttime = (finishTime - startTime) / 1000

    if (count > 1) {
        console.log(`  checkpoint ${flabel(':final')} | ${fnum(ctime)} elapsed | ${fnum(ttime)} total |`)
    } else {
        console.log(`  final | ${fnum(ttime)} total`)
    }
    console.log(`\ntime-function - tracking stopped - ${ttime}s`)
    console.log(`\nresult:\n\t${printToString(result)}\n`)

    return result
}

export default [tokenType('time-function'), functionType(`(time-function function-to-time)`, timeExecutionForm)]
