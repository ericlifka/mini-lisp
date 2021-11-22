import { assert } from "./assert"
import { 
    tokenType as token,
    functionType as fn,
    nullType,
    TYPE,
    numberType
} from "./types/types"

export const builtIns = [
    // Types
    [token('null'), nullType()],

    /* [ token('sym'), handler(function () {})] or something, idk yet */

    // Math
    [token('+'),  fn( argsList => {
        let val = 0
        let ptr = argsList.head
        while (ptr.type !== TYPE.null) {
            assert(ptr.value.type === TYPE.number, `Type error: + expected type number but got ${ptr.value.type}`)
            
            val += ptr.value.value
            ptr = ptr.next
        }
        return numberType(val)
    })]
]
