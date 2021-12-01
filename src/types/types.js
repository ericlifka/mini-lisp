export const TYPE = {
    cons: 'cons',
    list: 'list',
    vector: 'vector',
    hashmap: 'hashmap',
    boolean: 'boolean',
    string: 'string',
    number: 'number',
    token: 'token',
    null: 'null',
    specialForm: 'specialForm',
    function: 'function',
    macro: 'macro',
}

export const consType = (value = nullType(), next = nullType()) => ({
    type: TYPE.cons,
    value,
    next,
})

export const listType = () => ({
    type: TYPE.list,
    head: nullType(),
    last: nullType(),
})

export const vectorType = (value = []) => ({
    type: TYPE.vector,
    value,
})

export const hashmapType = () => ({
    type: TYPE.hashmap,
    keys: [],
    values: {},
})

export const booleanType = (value = false) => ({
    type: TYPE.boolean,
    value,
})

export const stringType = (value = '') => ({
    type: TYPE.string,
    value,
})

export const numberType = (value = 0) => ({
    type: TYPE.number,
    value,
})

export const tokenType = (value = '') => ({
    type: TYPE.token,
    value,
})

export const nullType = () => ({
    type: TYPE.null,
})

export const specialFormType = (doc, handler) => ({
    type: TYPE.specialForm,
    execute: handler,
    doc,
})

export const functionType = (doc, handler) => ({
    type: TYPE.function,
    execute: handler,
    doc,
})

export const macroType = (doc, handler) => ({
    type: TYPE.macro,
    execute: handler,
    doc,
})
