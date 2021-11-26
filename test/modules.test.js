import { run } from './test-run-helper'

describe('module systems', () => {
    test('dummy', () => {
        expect(true).toBe(true)
    })

    test.skip('declaring modules', () => {
        run(`
        (module 'environment
          (set dev-mode true))


        (module 'my-module
          (function add-1 (x)
            (+ 1 x))
          (function add-2 (x)
            (+ 2 x)))

          (set add-2 (fn (x) (+ 2 x)))
        `)
    })

    test.skip('importing modules', () => {
        run(`
        (import environment
               (my-module :as m))
        `)
    })
})
