import { assert } from '../assert'
import { promoteConsToList } from '../types/list'
import {
    tokenType,
    functionType,
    macroType,
    consType as cons,
    numberType,
    TYPE,
} from '../types/types'

export default [
    [
        tokenType('+'),
        functionType('(fn + ...numbers)', (params) => {
            let val = 0
            let ptr = params.head
            while (ptr.type !== TYPE.null) {
                assert(
                    ptr.value.type === TYPE.number,
                    `Type error: + expected type number but got ${ptr.value.type}`,
                )

                val += ptr.value.value
                ptr = ptr.next
            }
            return numberType(val)
        }),
    ],

    [
        tokenType('++1'),
        macroType('(macro ++1 arg)', (argsList) => {
            let plus = tokenType('+')
            let one = numberType(1)

            return promoteConsToList(cons(plus, cons(one, argsList.head)))
        }),
    ],
]
