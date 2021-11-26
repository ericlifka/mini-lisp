import { lookupModule } from '../scope'
import { listGetAtIndex } from '../types/list'
import { specialFormType, tokenType, TYPE } from '../types/types'

function importForm(argList, scope) {
    let argPtr = argList.head

    while (argPtr.type !== TYPE.null) {
        let entity = argPtr.value
        let module, name

        if (entity.type === TYPE.list) {
            module = listGetAtIndex(entity, 0)
            let name1 = listGetAtIndex(entity, 1)
            let name2 = listGetAtIndex(entity, 2)

            name = name1.value === ':as' ? name2 : name1
        } else {
            module = name = entity
        }

        scope.imports[name.value] = lookupModule(module)

        argPtr = argPtr.next
    }
}

export default [tokenType('import'), specialFormType('<import special form>', importForm)]
