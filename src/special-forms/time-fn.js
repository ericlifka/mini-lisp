import { arrayOfArguments } from '../destructuring'
import { printToString } from '../logger'
import { toList } from '../types/list'
import { functionType, specialFormType, tokenType, TYPE } from '../types/types'

function timeExecutionForm(params) {
    let [timedFunction] = arrayOfArguments(params, 1)
    let startTime = Date.now()
    let checkpoint = startTime
    let count = 1

    console.log('time-function, tracking started\n')

    let result = timedFunction.execute(
        toList(
            functionType(`(checkpoint)`, (param) => {
                let [tag] = arrayOfArguments(param, 1)
                let label = tag.type === TYPE.null ? count : printToString(tag)
                let newCheckpoint = Date.now()
                let ctime = (newCheckpoint - checkpoint) / 1000
                let ttime = (newCheckpoint - startTime) / 1000

                console.log(`  checkpoint ${label} - ${ctime}s elapsed, ${ttime}s total`)
                checkpoint = newCheckpoint
                count++
            })
        )
    )

    let finishTime = Date.now()
    let ctime = (finishTime - checkpoint) / 1000
    let ttime = (finishTime - startTime) / 1000

    if (count > 1) {
        console.log(`  final - ${ctime}s elapsed, ${ttime}s total`)
    } else {
        console.log(`  final - ${ttime}s total`)
    }
    console.log('\ntime-function, tracking stopped')
    console.log(`\nresult:\n\t${printToString(result)}`)

    return result
}

export default [tokenType('time-function'), functionType(`(time-function function-to-time)`, timeExecutionForm)]
