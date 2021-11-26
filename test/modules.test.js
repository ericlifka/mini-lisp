import { run } from './test-run-helper'

describe('module systems', () => {
    test('dummy', () => {
        expect(true).toBe(true)
    })

    test('can create and access a simple module', () => {
        expect(
            run(`
        (let ()
          (module 'module1
            (function get-five () 5))

          (import module1)
          (module1/get-five))`)
        ).toBe('5')
    })

    test('can rename modules', () => {
        expect(
            run(`
        (let ()
          (module 'module2
            (function get-five () 5))

          (import (module2 :as mod))
          (mod/get-five))`)
        ).toBe('5')
    })

    test('modules have a lexical scope', () => {
        expect(
            run(`
        (let (x 2)
          (module 'module3
            (function get-x () x))
          
          (import module3)
          (module3/get-x))`)
        ).toBe('2')
    })

    test('module lookup symbols can only be one deep', () => {
        expect(() => run(`(module/thing/other-stuff 5)`)).toThrow(`Symantic error: can only have one / in a symbol`)
    })

    test('error if module not imported', () => {
        expect(() =>
            run(`
        (let () 
          (module 'module4
            (function get-3 () 3))

          (module4/get-3)
        )`)
        ).toThrow(`Lexical error: module4 not imported in this scope`)
    })

    test('module import can be found up scope chain', () => {
        expect(
            run(`
        (let ()
          (module 'module5
            (function get-3 () 3))
          
          (import module5)
          (let ()
            (let ()
              (module5/get-3))))
        `)
        ).toBe('3')
    })

    test('can import more than one module at once', () => {
        expect(
            run(`
        (let ()
          (module 'module6
            (function get-3 () 3))
          (module 'module7
            (function get-4 () 4))

          (import module6
                 (module7 :as m7))
          (+ (module6/get-3) (m7/get-4)))
        `)
        ).toBe('7')
    })

    test('modules can import other modules', () => {
        expect(
            run(`
        (let ()
          (module 'module8
            (function add-3 (x) (+ 3 x)))

          (module 'module9
            (import module8)
            (function add-6 (x)
              (module8/add-3 (module8/add-3 x))))

          (import module9)
          (module9/add-6 7))
        `)
        ).toBe('13')
    })
})
